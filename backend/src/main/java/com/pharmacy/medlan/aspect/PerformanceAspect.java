package com.pharmacy.medlan.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class PerformanceAspect {

    private static final long SLOW_THRESHOLD_MS = 1000;

    @Around("execution(* com.pharmacy.medlan.service..*(..))")
    public Object measureServicePerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        return measurePerformance(joinPoint);
    }

    @Around("execution(* com.pharmacy.medlan.repository..*(..))")
    public Object measureRepositoryPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        return measurePerformance(joinPoint);
    }

    private Object measurePerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();

        long startTime = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long executionTime = System.currentTimeMillis() - startTime;

        if (executionTime > SLOW_THRESHOLD_MS) {
            log.warn("SLOW: {}.{}() took {}ms", className, methodName, executionTime);
        } else if (log.isTraceEnabled()) {
            log.trace("PERF: {}.{}() took {}ms", className, methodName, executionTime);
        }

        return result;
    }
}