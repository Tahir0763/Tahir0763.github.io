import jsPDF from 'jspdf';
import { EXPERIENCES, PROJECTS, SKILLS, CERTIFICATIONS } from '../data';

export const generateCV = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // --- Header ---
    // Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("Tahir Hussain", margin, y);
    y += 8;

    // Title
    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.setTextColor(80);
    doc.text("Data Analyst | Data Science Aspirant | AI Developer", margin, y);
    y += 5;

    // Contact Info (Right Aligned or below title)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(0);

    // We'll put contact info on the right side of the header area for a clean look, 
    // or simple stack it if space is tight. Let's stack it cleanly on the right.
    const contactX = pageWidth - margin;
    let contactY = 20;
    doc.text("Burewala - Punjab, Pakistan", contactX, contactY, { align: "right" });
    contactY += 5;
    doc.text("+92 302 7999986", contactX, contactY, { align: "right" });
    contactY += 5;
    doc.text("tahir.hussain66678@gmail.com", contactX, contactY, { align: "right" });
    contactY += 5;
    const linkColor = [0, 0, 238]; // Blue for links
    doc.setTextColor(0, 0, 238);
    doc.text("linkedin.com/in/tahir-hussain-a2488430a", contactX, contactY, { align: "right" });
    contactY += 5;
    doc.text("github.com/Tahir0763", contactX, contactY, { align: "right" });

    // Reset Text Color
    doc.setTextColor(0);
    y = Math.max(y, contactY) + 10;

    // Horizontal Line
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Helper function for Section Titles
    const addSectionTitle = (title: string) => {
        // Check for page break
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(title.toUpperCase(), margin, y);
        // Thick line next to title
        const titleWidth = doc.getTextWidth(title.toUpperCase());
        doc.setLineWidth(1.5);
        doc.line(margin + titleWidth + 5, y - 1, pageWidth - margin, y - 1);

        y += 8;
    };

    // --- Summary ---
    addSectionTitle("Summary");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const summaryText = "Highly motivated Computer Science student at FAST-NUCES with a deep passion for Data Science and Machine Learning. Proven track record in building data-driven software solutions, including satellite-integrated agricultural diagnostics and AI-powered meeting analytics. Expert at utilizing Python, SQL, and Tableau to extract actionable insights from complex datasets and delivering scalable predictive models that bridge the gap between raw data and strategic decision-making.";

    const splitSummary = doc.splitTextToSize(summaryText, pageWidth - (margin * 2));
    doc.text(splitSummary, margin, y);
    y += (splitSummary.length * 5) + 5;


    // --- Education ---
    addSectionTitle("Education");
    // Degree 1
    doc.setFont("helvetica", "bold");
    doc.text("2024–Present     BS Computer Science", margin, y);
    doc.setFont("helvetica", "italic");
    doc.text(", FAST National University of Computer and Emerging", margin + 75, y);
    y += 5;
    doc.text("Sciences, Pakistan", margin + 75, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const coursework = "Relevant Coursework: Data Analysis, Statistical Inference, Artificial Intelligence, Database Systems, Data Structures & Algorithms, Machine Learning.";
    const splitCourse = doc.splitTextToSize(coursework, pageWidth - (margin * 2) - 10);
    doc.text(splitCourse, margin + 40, y); // Indented
    y += (splitCourse.length * 5) + 8;
    doc.setFontSize(10);

    // --- Technical Skills ---
    addSectionTitle("Technical Skills");
    SKILLS.forEach(skillCat => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.setFont("helvetica", "bold");
        doc.text(skillCat.category, margin, y);
        doc.setFont("helvetica", "normal");
        const skillText = `: ${skillCat.skills.join(", ")}`;
        const splitSkill = doc.splitTextToSize(skillText, pageWidth - (margin * 2) - 40);
        doc.text(splitSkill, margin + 35, y);
        y += (splitSkill.length * 5) + 2;
    });
    y += 5;

    // --- Professional Experience ---
    addSectionTitle("Professional Experience");

    EXPERIENCES.forEach(exp => {
        if (y > 270) { doc.addPage(); y = 20; }

        // Date
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(exp.period.split("–")[0].trim(), margin, y); // Start date roughly
        // We can just put the full period on left or separate it. Let's follow the image style:
        // Date on left, generic text

        // Role & Company
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        // Indent role
        doc.text(`${exp.role},`, margin + 30, y);
        doc.setFont("helvetica", "italic");
        doc.text(` ${exp.company}`, margin + 30 + doc.getTextWidth(`${exp.role},`), y);

        y += 5;

        // Bullets
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        exp.details.forEach(detail => {
            if (y > 280) { doc.addPage(); y = 20; }
            const bullet = "o";
            doc.text(bullet, margin + 30, y);
            const splitDetail = doc.splitTextToSize(detail, pageWidth - (margin * 2) - 35);
            doc.text(splitDetail, margin + 35, y);
            y += (splitDetail.length * 4) + 1;
        });
        y += 4;
    });
    y += 2;

    // --- Projects ---
    addSectionTitle("Projects");
    PROJECTS.slice(0, 4).forEach(proj => {
        if (y > 270) { doc.addPage(); y = 20; }

        // Year left formatted
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(proj.year, margin, y);

        // Title & Type
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`${proj.title},`, margin + 30, y);
        doc.setFont("helvetica", "italic");
        doc.text(` Personal Project`, margin + 30 + doc.getTextWidth(`${proj.title},`), y);
        y += 5;

        // Description
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        proj.description.forEach(desc => {
            if (y > 280) { doc.addPage(); y = 20; }
            const bullet = "o";
            doc.text(bullet, margin + 30, y);
            const splitDesc = doc.splitTextToSize(desc, pageWidth - (margin * 2) - 35);
            doc.text(splitDesc, margin + 35, y);
            y += (splitDesc.length * 4) + 1;
        });
        y += 4;
    });

    // Footer / Page Number
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i}/${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: "right" });
    }

    doc.save("Tahir_Hussain_CV.pdf");
};
