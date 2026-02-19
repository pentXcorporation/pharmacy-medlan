package com.pharmacy.medlan.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Around("execution(* com.pharmacy.medlan.controller..*(..)) || " +
            "execution(* com.pharmacy.medlan.service..*(..))")
    public Object logMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();

        if (log.isDebugEnabled()) {
            log.debug(">> {}.{}() - Args: {}",
                    className, methodName,
                    maskSensitiveData(joinPoint.getArgs()));
        }

        try {
            Object result = joinPoint.proceed();
            if (log.isDebugEnabled()) {
                log.debug("<< {}.{}() - Success", className, methodName);
            }
            return result;
        } catch (Exception e) {
            log.error("!! {}.{}() - Error: {}", className, methodName, e.getMessage());
            throw e;
        }
    }

    private Object[] maskSensitiveData(Object[] args) {
        if (args == null) return new Object[0];
        return Arrays.stream(args)
                .map(arg -> {
                    if (arg == null) return "null";
                    String str = arg.toString();
                    if (str.contains("password")) return "[MASKED]";
                    if (str.length() > 100) return str.substring(0, 100) + "...";
                    return str;
                })
                .toArray();
    }
}