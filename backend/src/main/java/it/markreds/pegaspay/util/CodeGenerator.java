package it.markreds.pegaspay.util;

import java.security.SecureRandom;

public class CodeGenerator {
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(CodeGenerator.class);

    private CodeGenerator() {
    }

    public static String generateReadableCode(int length) {
        StringBuilder sb = new StringBuilder(length + length / 4 - 1);
        for (int i = 0; i < length; i++) {
            if (i > 0 && i % 4 == 0) {
                sb.append('-');
            }
            sb.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        String resultCode = sb.toString();
        log.debug("Generated new code: {}", resultCode);
        return resultCode;
    }
}
