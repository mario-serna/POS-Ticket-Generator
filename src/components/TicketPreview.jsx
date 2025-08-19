/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import PrintIcon from "@mui/icons-material/Print";
import Button from "@mui/material/Button";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

const TicketContainer = styled.div`
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  min-width: 320px;
  max-width: 320px;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 8px;
  background: white;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;

  @media print {
    border: none;
    box-shadow: none;
    max-width: 100%;
    padding: 0;

    /* Hide the print button when printing */
    .print-button {
      display: none;
    }

    /* Ensure proper spacing for print */
    ${"" /* Add any additional print-specific styles here */}
  }
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;

  .logo-container {
    margin: 0 auto 1rem;
    width: 100%;
    max-width: 200px;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: ${({ logoSize = 100 }) => `${logoSize}%`};
      height: auto;
      max-width: 100%;
      max-height: 150px;
      object-fit: contain;
      transition: width 0.2s ease-in-out;
    }
  }

  h1,
  h2,
  h3 {
    margin: 0.5rem 0;
    color: #333;
  }

  p {
    margin: 0.25rem 0;
    color: #555;
    font-size: 0.95em;
  }

  .contact-info {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px dashed #ddd;
  }
`;

const Content = styled.div`
  margin: 1.5rem 0;
  line-height: 1.5;
  color: #333;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 1.25rem 0 0.75rem;
    color: #1a1a1a;
  }

  p {
    margin: 0.75rem 0;
    line-height: 1.5;
  }

  ul,
  ol {
    margin: 0.75rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.4rem 0;
  }

  strong {
    font-weight: 600;
  }

  em {
    font-style: italic;
  }
`;

const Products = styled.div`
  margin: 1.5rem 0;

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.75rem 0;
    font-size: 0.95em;
  }

  th {
    text-align: left;
    padding: 0.5rem 0.25rem;
    border-bottom: 2px solid #e0e0e0;
    font-weight: 600;
    color: #555;
  }

  td {
    padding: 0.5rem 0.25rem;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: top;
  }

  tr:last-child td {
    border-bottom: 2px solid #e0e0e0;
  }

  .right {
    text-align: right;
  }

  .item-name {
    font-weight: 500;
  }
`;

const Totals = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 2px solid #e0e0e0;

  .row {
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0;
    padding: 0.25rem 0;
    font-size: 1.05em;
  }

  .subtotal {
    font-weight: 500;
  }

  .tax {
    color: #666;
  }

  .total {
    font-weight: 700;
    font-size: 1.3em;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 2px dashed #e0e0e0;
  }

  .divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #e0e0e0, transparent);
    margin: 0.5rem 0;
  }
`;

// Print button styles
const PrintButton = styled(Button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

// Print-specific styles
const printStyles = `
  @page { 
    size: 80mm auto;
    margin: 5mm;
  }
  body { 
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-family: Arial, sans-serif;
  }
  @media print {
    @page { 
      size: 80mm auto;
      margin: 0;
    }
    body { 
      margin: 0;
      padding: 1rem;
    }
  }

  p {
    margin: 0;
  }
`;

export const TicketPreview = ({
  fields,
  products,
  subtotal,
  tax,
  total,
  storeInfo,
}) => {
  console.log(fields, products, subtotal, tax, total);
  const printContentRef = useRef(null);
  const [rawHTML, setRawHTML] = useState("");

  const generateRawHTML = () => {
    let content = `
  <div style="max-width: 300px; margin: 0 auto;">
      <div>
        ${storeInfo.contentHeader}
      </div>
                  
      <div style="margin-bottom: 1rem; border-top: 1px solid #eee; padding-top: 0.5rem; font-size: 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="max-width: 100px; text-align: left; padding: 0.25rem 0; border-bottom: 1px solid #eee;">Producto</th>
              <th style="text-align: right; padding: 0.25rem 0; border-bottom: 1px solid #eee;">Cantidad</th>
              <th style="text-align: right; padding: 0.25rem 0; border-bottom: 1px solid #eee;">Precio</th>
              <th style="text-align: right; padding: 0.25rem 0; border-bottom: 1px solid #eee;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (product) => `
              <tr>
                <td style="max-width: 100px; padding: 0.25rem 0; border-bottom: 1px solid #f5f5f5;">${
                  product.name || "Item"
                }</td>
                <td style="text-align: right; padding: 0.25rem 0; border-bottom: 1px solid #f5f5f5;">${
                  product.quantity || 0
                }</td>
                <td style="text-align: right; padding: 0.25rem 0; border-bottom: 1px solid #f5f5f5;">$${(
                  product.price || 0
                ).toFixed(2)}</td>
                <td style="text-align: right; padding: 0.25rem 0; border-bottom: 1px solid #f5f5f5;">$${(
                  (product.price || 0) * (product.quantity || 0)
                ).toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
      
      <div style="padding-top: 0.5rem; padding-bottom: 0.5rem; border-top: 1px dashed #ddd; border-bottom: 1px dashed #ddd; font-size: 10px;">
        ${
          storeInfo.tax.hide
            ? ""
            : `
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <span>Subtotal:</span>
                <span>$${(subtotal || 0).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;">
                <span>IVA (${tax?.rate || 0}%):</span>
                <span>$${(tax?.amount || 0).toFixed(2)}</span>
              </div>
          `
        }
        <div style="display: flex; justify-content: space-between; font-weight: bold; padding-top: 0.5rem;">
          <span>Total:</span>
          <span>$${(total || 0).toFixed(2)}</span>
        </div>
      </div>
      
      <div style="color: #666; font-size: 0.9em; padding-top: 0.5rem;">
        <p style="margin: 0; text-align: center; font-size: 10px;">${format(
          new Date(),
          "yyyy-MM-dd HH:mm:ss"
        )}</p>
        ${storeInfo.contentFooter}
      </div>
    </div>`;

    if (fields.length) {
      fields.forEach((field) => {
        console.log("replace", field);
        content = content.replace(field.key, field.value);
      });
    }

    // Get the ticket HTML content
    const ticketContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Receipt</title>
      <style>${printStyles}</style>
    </head>
    <body>
      ${content}
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          }, 500);
        };
      </script>
    </body>
  </html>
`;
    setRawHTML(ticketContent);
  };

  useEffect(() => {
    generateRawHTML();
  }, [fields, products, subtotal, tax, total, storeInfo]);

  const handlePrint = () => {
    const printWindow = window.open("", "_PRINT", "height=600,width=800");

    if (!printWindow) {
      alert("Popup was blocked. Please allow popups for this site.");
      return;
    }

    // Write the content to the new window
    printWindow.document.open();
    printWindow.document.write(rawHTML);
    printWindow.document.close();
  };
  return (
    <>
      <PrintButton
        variant="contained"
        color="primary"
        startIcon={<PrintIcon />}
        onClick={handlePrint}
        className="print-button"
      >
        Imprimir Ticket
      </PrintButton>

      <TicketContainer ref={printContentRef}>
        <div dangerouslySetInnerHTML={{ __html: rawHTML }} />
      </TicketContainer>
    </>
  );
};
