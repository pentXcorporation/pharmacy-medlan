package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.enums.TransactionType;
import com.pharmacy.medlan.model.inventory.ProductBinCard;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.inventory.ProductBinCardRepository;
import com.pharmacy.medlan.repository.product.ProductRepository;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import com.pharmacy.medlan.repository.user.UserRepository;
import com.pharmacy.medlan.security.SecurityUtils;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ProductBinCardServiceImpl implements ProductBinCardService {

    private final ProductBinCardRepository productBinCardRepository;
    private final ProductRepository productRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;

    @Override
    public ProductBinCard recordTransaction(Long productId, Long branchId, TransactionType transactionType,
                                             Long referenceId, String referenceNumber,
                                             int quantityIn, int quantityOut, String description) {
        log.info("Recording bin card entry for product {} at branch {}: {} in, {} out",
                productId, branchId, quantityIn, quantityOut);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + branchId));

        User currentUser = null;
        try {
            currentUser = SecurityUtils.getCurrentUser(userRepository);
        } catch (Exception e) {
            log.debug("No authenticated user for bin card entry");
        }

        int previousBalance = getRunningBalance(productId, branchId);
        int newBalance = previousBalance + quantityIn - quantityOut;

        ProductBinCard binCard = ProductBinCard.builder()
                .product(product)
                .branch(branch)
                .user(currentUser)
                .transactionDate(LocalDateTime.now())
                .transactionType(transactionType)
                .referenceId(referenceId)
                .referenceNumber(referenceNumber)
                .quantityIn(quantityIn)
                .quantityOut(quantityOut)
                .runningBalance(newBalance)
                .description(description)
                .build();

        return productBinCardRepository.save(binCard);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductBinCard> getBinCardByProduct(Long productId) {
        return productBinCardRepository.findByProductId(productId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductBinCard> getBinCardByProductAndBranch(Long productId, Long branchId) {
        return productBinCardRepository.findByProductIdAndBranchId(productId, branchId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductBinCard> getBinCardByProductBranchAndDateRange(Long productId, Long branchId,
                                                                       LocalDateTime startDate, LocalDateTime endDate) {
        return productBinCardRepository.findByProductIdAndBranchId(productId, branchId)
                .stream()
                .filter(entry -> !entry.getTransactionDate().isBefore(startDate) && !entry.getTransactionDate().isAfter(endDate))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductBinCard> getBinCardByBranch(Long branchId) {
        return productBinCardRepository.findByBranchId(branchId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductBinCard> getBinCardByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return productBinCardRepository.findByTransactionDateBetween(startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public int getRunningBalance(Long productId, Long branchId) {
        List<ProductBinCard> entries = productBinCardRepository.findByProductIdAndBranchId(productId, branchId);
        if (entries.isEmpty()) return 0;
        return entries.get(entries.size() - 1).getRunningBalance();
    }
}
