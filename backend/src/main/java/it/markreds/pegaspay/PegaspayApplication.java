package it.markreds.pegaspay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class PegaspayApplication {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PegaspayApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(PegaspayApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void logEndpoints(ApplicationReadyEvent event) {
        ApplicationContext ctx = event.getApplicationContext();
        ctx.getBean(org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping.class)
                .getHandlerMethods()
                .forEach((mapping, handler) -> log.debug("Registered entrypoint: {}", mapping));
    }
}
