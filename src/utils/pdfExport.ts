import jsPDF from "jspdf";
import { DiaryEntry } from "@/hooks/useDiaryStorage";
import { getMoodEmoji } from "@/components/MoodSelector";
import { format } from "date-fns";

const inkColors: Record<string, [number, number, number]> = {
  brown: [54, 32, 18],
  blue: [26, 58, 102],
  purple: [76, 35, 102],
};

export async function exportToPDF(entries: DiaryEntry[]) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Add decorative border and parchment background color
  const addPageDecoration = () => {
    // Parchment background
    doc.setFillColor(245, 235, 220);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Decorative border
    doc.setDrawColor(139, 90, 43);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Corner decorations
    const corners = [
      [15, 15],
      [pageWidth - 15, 15],
      [15, pageHeight - 15],
      [pageWidth - 15, pageHeight - 15],
    ];

    doc.setFontSize(12);
    doc.setTextColor(184, 134, 11);
    corners.forEach(([x, y]) => {
      doc.text("✦", x, y, { align: "center" });
    });
  };

  // Title page
  addPageDecoration();
  
  doc.setTextColor(139, 90, 43);
  doc.setFontSize(32);
  doc.text("✦ My Magical Diary ✦", pageWidth / 2, 60, { align: "center" });
  
  doc.setFontSize(14);
  doc.setTextColor(100, 70, 40);
  doc.text("A Collection of Enchanted Memories", pageWidth / 2, 75, { align: "center" });
  
  doc.setFontSize(12);
  doc.text(`${sortedEntries.length} Entries`, pageWidth / 2, 90, { align: "center" });
  
  if (sortedEntries.length > 0) {
    const firstDate = format(new Date(sortedEntries[sortedEntries.length - 1].date), "MMMM d, yyyy");
    const lastDate = format(new Date(sortedEntries[0].date), "MMMM d, yyyy");
    doc.text(`From ${firstDate} to ${lastDate}`, pageWidth / 2, 100, { align: "center" });
  }

  // Draw a decorative quill
  doc.setFontSize(40);
  doc.text("🪶", pageWidth / 2, 140, { align: "center" });

  // Entry pages
  sortedEntries.forEach((entry, index) => {
    doc.addPage();
    addPageDecoration();

    let yPos = 30;

    // Date header
    doc.setFontSize(16);
    doc.setTextColor(139, 90, 43);
    const dateStr = format(new Date(entry.date), "EEEE, MMMM do, yyyy");
    doc.text(dateStr, pageWidth / 2, yPos, { align: "center" });

    // Mood and seal indicators
    yPos += 10;
    doc.setFontSize(12);
    const moodText = entry.mood ? `${getMoodEmoji(entry.mood)} ${entry.mood}` : "";
    const sealText = entry.isSealed ? "⚡ Sealed" : "";
    const indicators = [moodText, sealText].filter(Boolean).join("  •  ");
    if (indicators) {
      doc.text(indicators, pageWidth / 2, yPos, { align: "center" });
    }

    // Decorative line
    yPos += 8;
    doc.setDrawColor(184, 134, 11);
    doc.setLineWidth(0.3);
    doc.line(margin + 20, yPos, pageWidth - margin - 20, yPos);

    // Content
    yPos += 15;
    const inkColor = inkColors[entry.inkColor || "brown"] || inkColors.brown;
    doc.setTextColor(...inkColor);
    doc.setFontSize(12);

    // Split content into lines
    const lines = doc.splitTextToSize(entry.content || "(Empty entry)", contentWidth);
    
    lines.forEach((line: string) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        addPageDecoration();
        yPos = 30;
        doc.setTextColor(...inkColor);
      }
      doc.text(line, margin, yPos);
      yPos += 7;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 120, 90);
    doc.text(
      `Page ${index + 2} of ${sortedEntries.length + 1}`,
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );
  });

  // Save the PDF
  const fileName = `magical-diary-${format(new Date(), "yyyy-MM-dd")}.pdf`;
  doc.save(fileName);
}
