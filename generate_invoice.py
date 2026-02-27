from fpdf import FPDF
import datetime

class InvoicePDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'COMMERCIAL INVOICE', 0, 1, 'C')

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_invoice():
    pdf = InvoicePDF()
    pdf.add_page()
    pdf.set_font('Arial', '', 12)

    # Shipper
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'SHIPPER:', 0, 1)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 8, 'Shenzhen Electronics Co., Ltd.', 0, 1)
    pdf.cell(0, 8, 'No. 88, Tech Park Road, Nanshan District', 0, 1)
    pdf.cell(0, 8, 'Shenzhen, Guangdong, 518000', 0, 1)
    pdf.cell(0, 8, 'China', 0, 1)
    pdf.ln(5)

    # Consignee
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'CONSIGNEE:', 0, 1)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 8, 'US Importer Inc.', 0, 1)
    pdf.cell(0, 8, '123 Main Street', 0, 1)
    pdf.cell(0, 8, 'San Francisco, CA 94105', 0, 1)
    pdf.cell(0, 8, 'USA', 0, 1)
    pdf.ln(10)

    # Invoice Details
    pdf.cell(0, 8, f'Invoice Number: SINV-2024-001', 0, 1)
    pdf.cell(0, 8, f'Date: {datetime.date.today()}', 0, 1)
    pdf.ln(10)

    # Items Table Header
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(80, 10, 'Description of Goods', 1, 0, 'C')
    pdf.cell(40, 10, 'HS Code', 1, 0, 'C')
    pdf.cell(30, 10, 'Origin', 1, 0, 'C')
    pdf.cell(40, 10, 'Value (USD)', 1, 1, 'C')

    # Item Row (Triggering Section 301 List 3)
    pdf.set_font('Arial', '', 12)
    pdf.cell(80, 10, 'Insulated Electric Conductors (Cables)', 1, 0)
    pdf.cell(40, 10, '8544.42.00', 1, 0, 'C')
    pdf.cell(30, 10, 'China', 1, 0, 'C')
    pdf.cell(40, 10, '5,000.00', 1, 1, 'R')
    
    # Total
    pdf.ln(5)
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(150, 10, 'TOTAL VALUE:', 0, 0, 'R')
    pdf.cell(40, 10, '5,000.00', 0, 1, 'R')


    pdf.output('test_invoice_china_301.pdf', 'F')
    print("PDF Generated: test_invoice_china_301.pdf")

if __name__ == "__main__":
    generate_invoice()
