import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Register fonts if needed
// Font.register({
//   family: 'Roboto',
//   src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
// });

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  scoreSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  scoreText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },
  card: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9fafb",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  cardStatus: {
    fontSize: 12,
    padding: "2px 8px",
    borderRadius: 3,
  },
  statusNormal: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
  statusWarning: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  statusError: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
  },
  cardContent: {
    fontSize: 12,
    color: "#4b5563",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
  },
});

// Helper function to get status style
const getStatusStyle = (status) => {
  switch (status) {
    case "normal":
      return styles.statusNormal;
    case "warning":
      return styles.statusWarning;
    case "error":
      return styles.statusError;
    default:
      return styles.statusNormal;
  }
};

// Helper function to format card title
const formatCardTitle = (type) => {
  return type.replace(/([A-Z])/g, " $1").trim();
};

const PDFReport = ({ data, score }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>SEO Analysis Report</Text>
          <Text style={styles.subtitle}>
            Generated on {format(new Date(), "MMMM d, yyyy")}
          </Text>
        </View>

        <View style={styles.scoreSection}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{score}/100</Text>
          </View>
          <View>
            <Text style={styles.scoreLabel}>Overall SEO Score</Text>
          </View>
        </View>

        {data.map((card, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {formatCardTitle(card.type)}
            </Text>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {formatCardTitle(card.type)}
                </Text>
                <Text style={[styles.cardStatus, getStatusStyle(card.status)]}>
                  {card.status.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.cardContent}>
                {typeof card.analysis === "object"
                  ? JSON.stringify(card.analysis)
                  : card.analysis}
              </Text>
            </View>
          </View>
        ))}

        <Text style={styles.footer}>
          Generated by SEO Check Tool | {format(new Date(), "yyyy")}
        </Text>
      </Page>
    </Document>
  );
};

export default PDFReport;
