package it.markreds.pegaspay.controller;

import it.markreds.pegaspay.model.RechargeCode;
import it.markreds.pegaspay.service.AdminService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/recharge-code")
    public Map<String, Object> generateCode(@RequestParam BigDecimal amount) {
        RechargeCode rechargeCode = adminService.generateCode(amount);
        return Map.of(
                "code", rechargeCode.getCode(),
                "amount", rechargeCode.getAmount(),
                "createdAt", rechargeCode.getCreatedAt()
        );
    }
}
