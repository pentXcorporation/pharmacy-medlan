package com.pharmacy.medlan.service.product;

import com.pharmacy.medlan.dto.request.product.UpdatePricingRequest;
import com.pharmacy.medlan.dto.response.product.ProductPricingResponse;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.model.product.ProductPricing;
import com.pharmacy.medlan.repository.product.ProductPricingRepository;
import com.pharmacy.medlan.repository.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ProductPricingServiceImpl implements ProducPricingService {

    private final ProductPricingRepository pricingRepository;
    private final ProductRepository productRepository;

    @Override
    public ProductPricingResponse updatePricing(UpdatePricingRequest request) {
        log.info("Updating pricing for product: {}", request.getProductId());

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        // Deactivate current pricing
        pricingRepository.findCurrentPricingByProduct(request.getProductId())
                .ifPresent(current -> {
                    current.setIsCurrent(false);
                    pricingRepository.save(current);
                });

        BigDecimal profitMargin = request.getProfitMargin();
        if (profitMargin == null && request.getCostPrice().compareTo(BigDecimal.ZERO) > 0) {
            profitMargin = request.getSellingPrice().subtract(request.getCostPrice())
                    .divide(request.getCostPrice(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }

        ProductPricing pricing = ProductPricing.builder()
                .product(product)
                .effectiveDate(request.getEffectiveDate() != null ? request.getEffectiveDate() : LocalDate.now())
                .costPrice(request.getCostPrice())
                .sellingPrice(request.getSellingPrice())
                .mrp(request.getMrp())
                .profitMargin(profitMargin)
                .isCurrent(true)
                .build();

        // Also update the product's prices
        product.setCostPrice(request.getCostPrice());
        product.setSellingPrice(request.getSellingPrice());
        product.setMrp(request.getMrp());
        product.setProfitMargin(profitMargin);
        productRepository.save(product);

        ProductPricing saved = pricingRepository.save(pricing);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductPricingResponse getCurrentPricing(Long productId) {
        ProductPricing pricing = pricingRepository.findCurrentPricingByProduct(productId)
                .orElseThrow(() -> new ResourceNotFoundException("No current pricing found for product: " + productId));
        return toResponse(pricing);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductPricingResponse> getPricingHistory(Long productId) {
        return pricingRepository.findByProductId(productId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ProductPricingResponse toResponse(ProductPricing pricing) {
        return ProductPricingResponse.builder()
                .id(pricing.getId())
                .productId(pricing.getProduct() != null ? pricing.getProduct().getId() : null)
                .productName(pricing.getProduct() != null ? pricing.getProduct().getProductName() : null)
                .productCode(pricing.getProduct() != null ? pricing.getProduct().getProductCode() : null)
                .effectiveDate(pricing.getEffectiveDate())
                .costPrice(pricing.getCostPrice())
                .sellingPrice(pricing.getSellingPrice())
                .mrp(pricing.getMrp())
                .profitMargin(pricing.getProfitMargin())
                .isCurrent(pricing.getIsCurrent())
                .createdAt(pricing.getCreatedAt())
                .build();
    }
}
