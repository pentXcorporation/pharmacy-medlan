package com.pharmacy.medlan.service.finance;

import com.pharmacy.medlan.dto.response.finance.BankResponse;
import com.pharmacy.medlan.model.finance.Bank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface BankService {
    
    Page<BankResponse> getAllBanks(Pageable pageable);
    
    List<BankResponse> getAllActiveBanks();
    
    BankResponse getBankById(Long id);
    
    BankResponse createBank(Bank bank);
    
    BankResponse updateBank(Long id, Bank bank);
    
    void deleteBank(Long id);
    
    void updateBalance(Long id, BigDecimal amount);
    
    BigDecimal getTotalBalance();
}
