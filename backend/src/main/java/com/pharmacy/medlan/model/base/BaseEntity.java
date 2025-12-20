package com.pharmacy.medlan.model.base;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

    @Version
    @Column(name = "version")
    private Long version; // Optimistic locking
}
