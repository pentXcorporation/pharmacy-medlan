package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.dto.request.inventory.CreateGRNRequest;
import com.pharmacy.medlan.dto.response.inventory.GRNResponse;
import com.pharmacy.medlan.enums.GRNStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface GRNService {

    GRNResponse createGRN(CreateGRNRequest request);

    GRNResponse updateGRN(Long id, CreateGRNRequest request);

    GRNResponse getGRNById(Long id);

    GRNResponse getGRNByNumber(String grnNumber);

    Page<GRNResponse> getAllGRNs(Pageable pageable);

    Page<GRNResponse> getGRNsByBranch(Long branchId, Pageable pageable);

    Page<GRNResponse> getGRNsBySupplier(Long supplierId, Pageable pageable);

    List<GRNResponse> getGRNsByDateRange(LocalDate startDate, LocalDate endDate);

    Page<GRNResponse> getGRNsByStatus(GRNStatus status, Pageable pageable);

    GRNResponse approveGRN(Long id);

    GRNResponse rejectGRN(Long id, String reason);

    GRNResponse cancelGRN(Long id, String reason);

    String generateGRNNumber();
}
