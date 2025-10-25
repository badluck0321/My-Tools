package com.example.BackEnd_MyTools.Logging;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
@Order(1) // Run first - before Spring Security
@RequiredArgsConstructor
public class RequestLoggingFilter implements Filter {

    private final LoggingService loggingService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        long startTime = System.currentTimeMillis();

        try {
            // 🎯 STEP 1: Log incoming request (ALWAYS)
            loggingService.logCompleteRequest(httpRequest);

            // 🎯 STEP 2: Let the request continue through the application
            chain.doFilter(request, response);

            long duration = System.currentTimeMillis() - startTime;

            // 🎯 STEP 3: Log successful response (ALWAYS)
            loggingService.logCompleteResponse(httpRequest, httpResponse, duration);

        } catch (Exception ex) {
            long duration = System.currentTimeMillis() - startTime;
            // 🎯 STEP 4: Log errors (ALWAYS)
            loggingService.logError(httpRequest, httpResponse, ex, duration);
            throw ex;
        }
    }
}

//////////////old code//////////////

// package com.example.BackEnd_MyTools.Logging;

// import jakarta.servlet.*;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;
// import org.springframework.core.annotation.Order;
// import org.springframework.stereotype.Component;
// import java.io.IOException;

// @Component
// @Order(1)
// @RequiredArgsConstructor
// public class RequestLoggingFilter implements Filter {
    
//     private final LoggingService loggingService;

//     @Override
//     public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
//             throws IOException, ServletException {
        
//         HttpServletRequest httpRequest = (HttpServletRequest) request;
//         HttpServletResponse httpResponse = (HttpServletResponse) response;
        
//         long startTime = System.currentTimeMillis();
        
//         try {
//             // Log EVERY request
//             loggingService.logCompleteRequest(httpRequest);
            
//             // Continue with the request
//             chain.doFilter(request, response);
            
//             long duration = System.currentTimeMillis() - startTime;
            
//             // Log EVERY response
//             loggingService.logCompleteResponse(httpRequest, httpResponse, duration);
            
//         } catch (Exception ex) {
//             long duration = System.currentTimeMillis() - startTime;
//             loggingService.logError(httpRequest, httpResponse, ex, duration);
//             throw ex;
//         }
//     }
// }