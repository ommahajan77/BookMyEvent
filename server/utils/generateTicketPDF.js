const PDFDocument = require("pdfkit");

// Streams a PDF ticket to the given response object
const generateTicketPDF = (res, booking, event, user) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=ticket-${booking.bookingId}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(22).fillColor("#4f46e5").text("BookMyEvent", { align: "center" });
  doc.moveDown();
  doc.fontSize(16).fillColor("black").text("E-Ticket", { align: "center" });
  doc.moveDown(2);

  doc.fontSize(12).fillColor("black");
  doc.text(`Booking ID: ${booking.bookingId}`);
  doc.text(`Event: ${event.title}`);
  doc.text(`Location: ${event.location}`);
  doc.text(`Date: ${new Date(event.date).toDateString()}`);
  doc.text(`Time: ${event.time}`);
  doc.text(`Seats: ${booking.selectedSeats.join(", ")}`);
  doc.text(`Amount Paid: ₹${booking.totalAmount}`);
  doc.text(`Booked By: ${user.name} (${user.email})`);
  doc.text(`Payment Status: ${booking.paymentStatus}`);
  doc.moveDown();

  if (booking.ticketQR) {
    const base64Data = booking.ticketQR.replace(/^data:image\/png;base64,/, "");
    const imgBuffer = Buffer.from(base64Data, "base64");
    doc.image(imgBuffer, { fit: [150, 150], align: "center" });
  }

  doc.moveDown();
  doc.fontSize(10).fillColor("gray").text("Please show this ticket (QR code) at the venue entrance.", { align: "center" });

  doc.end();
};

module.exports = generateTicketPDF;
