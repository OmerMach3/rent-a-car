package com.rentacar.service.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationLink(String toEmail, String token) {
        String subject = "Set Your Password";
        String confirmationLink = "http://localhost:3000/set-password?token=" + token;

        String htmlContent = "<div style='font-family: Arial, sans-serif; font-size: 14px;'>"
                + "<h2 style='color: #2e6c80;'>Rentacar'a welcome!</h2>"
                + "<p>click the link:</p>"
                + "<a href='" + confirmationLink + "' style='display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; border-radius: 5px; text-decoration: none;'>Set Password</a>"
                + "<p>If you didn’t request this, I don't carfe </p>"
                + "<p style='margin-top: 30px;'>Regards,<br>Omer Boru by Rent-a-car</p>"
                + "</div>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);  // true for HTML content

            mailSender.send(message);
            System.out.println(" HTML mail sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println(" Failed to send HTML email");
            e.printStackTrace();
        }
    }
}
