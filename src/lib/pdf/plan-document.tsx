import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { PlanWithCareers, TimelineStep } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#0f172a",
  },
  header: {
    backgroundColor: "#2563eb",
    padding: 20,
    marginBottom: 20,
    marginTop: -40,
    marginLeft: -40,
    marginRight: -40,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#bfdbfe",
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    color: "#1e293b",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
  },
  careerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  careerTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  careerDetail: {
    fontSize: 10,
    color: "#475569",
  },
  timelineStep: {
    flexDirection: "row",
    marginBottom: 10,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563eb",
    marginTop: 3,
    marginRight: 10,
  },
  timelineContent: {
    flex: 1,
  },
  timelineYear: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
    marginBottom: 2,
  },
  timelineTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  timelineDesc: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 2,
  },
  timelineDetail: {
    fontSize: 9,
    color: "#64748b",
    marginLeft: 8,
    marginBottom: 1,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    fontSize: 10,
    color: "#475569",
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  skillBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 8,
    color: "#475569",
  },
});

interface PlanDocumentProps {
  plan: PlanWithCareers;
  timeline: TimelineStep[];
  userName?: string;
}

export function PlanDocument({ plan, timeline, userName }: PlanDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CareerIgnite</Text>
          <Text style={styles.headerSubtitle}>Career Pathway Plan</Text>
        </View>

        {/* Meta */}
        <View style={styles.meta}>
          <Text>Plan: {plan.title}</Text>
          <Text>{userName ? `Student: ${userName}` : ""}</Text>
          <Text>Date: {new Date().toLocaleDateString("en-AU")}</Text>
        </View>

        {/* Careers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Careers</Text>
          {plan.careers.map((pc) => (
            <View key={pc.id}>
              <View style={styles.careerRow}>
                <View>
                  <Text style={styles.careerTitle}>{pc.career.title}</Text>
                  <Text style={styles.careerDetail}>
                    ${(pc.career.salaryLow / 1000).toFixed(0)}k - $
                    {(pc.career.salaryHigh / 1000).toFixed(0)}k | Growth:{" "}
                    {pc.career.growthRate > 0 ? "+" : ""}
                    {pc.career.growthRate}%
                  </Text>
                </View>
              </View>
              <View style={styles.skills}>
                {pc.career.skills.map((skill) => (
                  <Text key={skill} style={styles.skillBadge}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Timeline */}
        {timeline.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pathway Timeline</Text>
            {timeline.map((step) => (
              <View key={step.id} style={styles.timelineStep}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineYear}>{step.year}</Text>
                  <Text style={styles.timelineTitle}>{step.title}</Text>
                  <Text style={styles.timelineDesc}>{step.description}</Text>
                  {step.details?.map((detail, i) => (
                    <Text key={i} style={styles.timelineDetail}>
                      • {detail}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>
            Generated by CareerIgnite | Career data is indicative only — please
            verify requirements directly with institutions.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
