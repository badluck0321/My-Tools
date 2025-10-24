package com.example.BackEnd_MyTools.Logging;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import static com.example.BackEnd_MyTools.Security.SecurityConfig.getUserInfo;

@Aspect
@Component
public class LoggingLogic {

    @Autowired
    private MongoTemplate mongo;

    @Around("within(@org.springframework.web.bind.annotation.RestController *)")
    public Object logRestCall(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();

        // proceed
        Object result = pjp.proceed();

        long duration = System.currentTimeMillis() - start;
        var attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs != null) {
            HttpServletRequest req = attrs.getRequest();
            HttpServletResponse res = attrs.getResponse();

            LogEntry e = new LogEntry();
            e.setMethod(req.getMethod());
            e.setPath(req.getRequestURI());
            e.setUsername(getUserInfo());
            e.setStatus(res != null ? res.getStatus() : 0);
            e.setDurationMs(duration);
            e.setTimestamp(System.currentTimeMillis());
            mongo.save(e);
            // print to console
            System.out.printf("[%s] %s %s (%d) %dms%n",
                    e.getUsername(),
                    e.getMethod(),
                    e.getPath(),
                    e.getStatus(),
                    e.getDurationMs());

        }
        return result;
    }
}
