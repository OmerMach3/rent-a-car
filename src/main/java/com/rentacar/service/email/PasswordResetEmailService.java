package com.rentacar.service.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;

@Service
public class PasswordResetEmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetLink(String toEmail, String token) {
        String subject = "Reset Your Password";
        String resetLink = "http://localhost:3000/reset-password?token=" + token;

        String htmlContent = "<div style='font-family: Arial, sans-serif; font-size: 14px;'>"
                + "<h2 style='color: #2e6c80;'>Password Reset Request</h2>"
                + "<p>You have requested to reset your password for your Rent-A-Car account.</p>"
                + "<p>Click the link below to reset your password:</p>"
                + "<a href='" + resetLink + "' style='display: inline-block; padding: 10px 20px; color: white; background-color: #dc3545; border-radius: 5px; text-decoration: none;'>Reset Password</a>"
                + "<p style='margin-top: 20px; color: #856404; background-color: #fff3cd; padding: 10px; border-radius: 4px;'>"
                + "<strong>Important:</strong> This link will expire in 15 minutes for security reasons."
                + "</p>"
                + "<p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>"
                + "<p style='margin-top: 30px;'>Regards,<br>Rent-A-Car Team</p>"
                + "</div>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);  // true for HTML content

            mailSender.send(message);
            System.out.println(" Password reset email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println(" Failed to send password reset email");
            e.printStackTrace();
        }
    }
}