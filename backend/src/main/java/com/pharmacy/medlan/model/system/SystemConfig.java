package com.pharmacy.medlan.model.system;

import com.pharmacy.medlan.model.base.AuditableEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "system_config",
        uniqueConstraints = @UniqueConstraint(columnNames = {"config_key"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class SystemConfig extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "config_key", nullable = false, unique = true, length = 100)
    @NotBlank(message = "Config key is required")
    @EqualsAndHashCode.Include
    private String configKey;

    @Column(name = "config_value", columnDefinition = "TEXT")
    private String configValue;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "data_type", length = 50)
    private String dataType;

    @Column(name = "is_editable", nullable = false)
    @Builder.Default
    private Boolean isEditable = true;
}