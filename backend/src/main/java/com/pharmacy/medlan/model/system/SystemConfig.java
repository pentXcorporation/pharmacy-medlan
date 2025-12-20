package com.pharmacy.medlan.model.system;

import com.pharmacy.medlan.model.base.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_config",
        uniqueConstraints = @UniqueConstraint(columnNames = {"config_key"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemConfig extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "config_key", nullable = false, unique = true, length = 100)
    private String configKey;

    @Column(name = "config_value", columnDefinition = "TEXT")
    private String configValue;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "category", length = 100)
    private String category; // GENERAL, SALES, INVENTORY, FINANCE

    @Column(name = "data_type", length = 50)
    private String dataType; // STRING, INTEGER, BOOLEAN, DECIMAL

    @Column(name = "is_editable", nullable = false)
    private Boolean isEditable = true;
}