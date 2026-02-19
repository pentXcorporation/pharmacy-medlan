package com.pharmacy.medlan.service.product;

import com.pharmacy.medlan.dto.request.product.UpdatePricingRequest;
import com.pharmacy.medlan.dto.response.product.ProductPricingResponse;

import java.util.List;

public interface ProducPricingService {

    ProductPricingResponse updatePricing(UpdatePricingRequest request);

    ProductPricingResponse getCurrentPricing(Long productId);

    List<ProductPricingResponse> getPricingHistory(Long productId);
}
