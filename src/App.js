import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function App() {
  const [risk, setRisk] = useState("");
  const [grade, setGrade] = useState("");
  const [stage, setStage] = useState("");
  const [size, setSize] = useState("");
  const [number, setNumber] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [cis, setCis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [schedule, setSchedule] = useState([]);

  const handleSubmit = () => {
    let riskLevel = "";

    if (
      grade === "low" &&
      size === "<3cm" &&
      number === "single" &&
      recurrence === "no" &&
      cis === "no"
    ) {
      riskLevel = "Low Risk";
    } else if (grade === "high" || cis === "yes") {
      riskLevel = "High Risk";
    } else {
      riskLevel = "Intermediate Risk";
    }

    setRisk(riskLevel);

    let treatmentPlan = "";
    if (riskLevel === "Low Risk") {
      treatmentPlan = "Consider single-dose Mitomycin within 24 hours of TURBT. No BCG needed.";
    } else if (riskLevel === "Intermediate Risk") {
      treatmentPlan = "BCG Induction (6 weekly) + Maintenance for 1 year or Mitomycin weekly for 6 weeks.";
    } else if (riskLevel === "High Risk") {
      treatmentPlan = "BCG Induction (6 weekly) + Maintenance for up to 3 years per SWOG protocol.";
    }

    setTreatment(treatmentPlan);
    if (startDate) generateSchedule(startDate, riskLevel);
  };

  const generateSchedule = (dateStr, riskLevel) => {
    const base = new Date(dateStr);
    const intervals =
      riskLevel === "Low Risk"
        ? [3, 12, 24, 36, 48, 60]
        : riskLevel === "Intermediate Risk"
        ? [3, 6, 12, 18, 24, 30, 36, 48, 60]
        : [3, 6, 9, 12, 18, 24, 30, 36, 48, 60];

    const dates = intervals.map((months) => {
      const d = new Date(base);
      d.setMonth(d.getMonth() + months);
      return d.toDateString();
    });

    setSchedule(dates);
  };

  const handleCopy = async () => {
    if (treatment) {
      await navigator.clipboard.writeText(`Risk: ${risk}\nTreatment: ${treatment}`);
      alert("Treatment plan copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (treatment) {
      const blob = new Blob([
        `Bladder Cancer Risk Stratification\n\nRisk Category: ${risk}\n\nTreatment Plan:\n${treatment}`
      ], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "bladder_treatment_plan.txt";
      link.click();
    }
  };

  const handleDownloadICS = () => {
    if (schedule.length === 0) return;
    let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n";
    schedule.forEach((date, i) => {
      const d = new Date(date);
      const dt = d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      ics += `BEGIN:VEVENT\nSUMMARY:Bladder Cancer Surveillance Visit\nDTSTART:${dt}\nDTEND:${dt}\nDESCRIPTION:Scheduled surveillance cystoscopy\nEND:VEVENT\n`;
    });
    ics += "END:VCALENDAR";

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bladder_surveillance_schedule.ics";
    link.click();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-sky-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-sky-800">Bladder Cancer Risk Stratification Tool</h1>
      <Card className="shadow-md border-sky-200">
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sky-800">Grade</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sky-800">Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger><SelectValue placeholder="Select Stage" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ta">Ta</SelectItem>
                  <SelectItem value="T1">T1</SelectItem>
                  <SelectItem value="CIS">CIS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sky-800">Tumour Size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger><SelectValue placeholder="Select Size" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="<3cm">&lt; 3cm</SelectItem>
                  <SelectItem value=">3cm">&gt; 3cm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sky-800">Number of Tumours</Label>
              <Select value={number} onValueChange={setNumber}>
                <SelectTrigger><SelectValue placeholder="Select Number" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="multiple">Multiple</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sky-800">Prior Recurrence</Label>
              <Select value={recurrence} onValueChange={setRecurrence}>
                <SelectTrigger><SelectValue placeholder="Select Option" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sky-800">CIS Present</Label>
              <Select value={cis} onValueChange={setCis}>
                <SelectTrigger><SelectValue placeholder="Select Option" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-sky-800">Date of TURBT</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleSubmit} className="bg-sky-700 hover:bg-sky-800 text-white">Submit</Button>
          {risk && (
            <div className="mt-4 text-lg font-semibold text-sky-800">
              Risk Category: <span className="text-sky-900">{risk}</span>
            </div>
          )}
          {treatment && (
            <div className="mt-2 text-base text-gray-800 border border-sky-200 rounded p-4 bg-white shadow">
              <strong className="block mb-2 text-sky-700">Treatment Plan:</strong>
              <p>{treatment}</p>
              <div className="mt-4 flex space-x-2">
                <Button onClick={handleCopy} variant="outline">Copy to Clipboard</Button>
                <Button onClick={handleDownload} variant="secondary">Download as TXT</Button>
              </div>
            </div>
          )}
          {schedule.length > 0 && (
            <div className="mt-6 text-base text-gray-800">
              <h2 className="font-semibold text-lg mb-2 text-sky-800">Surveillance Schedule:</h2>
              <ul className="list-disc list-inside">
                {schedule.map((date, index) => (
                  <li key={index}>{date}</li>
                ))}
              </ul>
              <div className="mt-4">
                <Button onClick={handleDownloadICS} variant="outline">Download as Calendar (.ics)</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default App;
