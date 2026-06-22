package com.example.BackEnd_MyTools.Services;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.BackEnd_MyTools.Entitys.Order;

@Service
public class InvoiceService {
    public byte[] generateInvoicePdf(Order order) {
        List<String> lines = new ArrayList<>();
        lines.add("My-Tools Invoice");
        lines.add("Invoice: " + safe(order.getInvoiceNumber()));
        lines.add("Order ID: " + safe(order.getId()));
        lines.add("Buyer: " + safe(order.getBuyerUsername()));
        lines.add("Status: " + order.getStatus());
        lines.add("Created: " + order.getCreatedAt());
        lines.add(" ");
        lines.add("Items:");
        if (order.getItems() != null) {
            order.getItems().forEach(item -> lines.add("- " + safe(item.getProductName()) + " x" + item.getQuantity() + " = " + item.getLineTotal()));
        }
        lines.add(" ");
        lines.add("Total: " + order.getTotalAmount() + " MAD");
        return simplePdf(lines);
    }

    private byte[] simplePdf(List<String> lines) {
        StringBuilder content = new StringBuilder("BT /F1 12 Tf 14 TL 50 790 Td ");
        for (String line : lines) {
            content.append("(").append(escape(line)).append(") Tj T* ");
        }
        content.append("ET");
        byte[] stream = content.toString().getBytes(StandardCharsets.UTF_8);

        List<String> objects = List.of(
            "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n",
            "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n",
            "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n",
            "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n",
            "5 0 obj << /Length " + stream.length + " >> stream\n" + new String(stream, StandardCharsets.UTF_8) + "\nendstream endobj\n"
        );

        StringBuilder pdf = new StringBuilder("%PDF-1.4\n");
        List<Integer> offsets = new ArrayList<>();
        offsets.add(0);
        for (String object : objects) {
            offsets.add(pdf.length());
            pdf.append(object);
        }
        int xrefOffset = pdf.length();
        pdf.append("xref\n0 ").append(objects.size() + 1).append("\n");
        pdf.append("0000000000 65535 f \n");
        for (int i = 1; i < offsets.size(); i++) {
            pdf.append(String.format("%010d 00000 n \n", offsets.get(i)));
        }
        pdf.append("trailer << /Size ").append(objects.size() + 1).append(" /Root 1 0 R >>\n");
        pdf.append("startxref\n").append(xrefOffset).append("\n%%EOF");
        return pdf.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escape(String value) {
        return safe(value).replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)");
    }

    private String safe(Object value) {
        return value == null ? "" : String.valueOf(value);
    }
}
