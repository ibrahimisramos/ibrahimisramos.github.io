// Add your writeups here. This file is loaded as a script so it works
// locally (file://) and on GitHub Pages without any server needed.
window.WRITEUPS = [
  {
    "title": "Systemic IDOR Across All Resource Controllers in Open-Source CRM",
    "category": "Red Team",
    "tags": ["IDOR", "Web", "Responsible Disclosure", "API"],
    "date": "2025",
    "description": "Discovered a systemic IDOR vulnerability affecting all major resource controllers in a widely-used open-source CRM platform. Any authenticated user could read, modify, or delete resources belonging to other users by manipulating object IDs.",
    "link": "",
    "status": "Disclosure in Progress"
  },
  {
    "title": "Bypassing RASP and SSL Pinning on iOS Banking Application",
    "category": "Red Team",
    "tags": ["Mobile", "iOS", "Frida", "SSL Pinning", "RASP"],
    "date": "2025",
    "description": "Bypassed Runtime Application Self-Protection (RASP) and SSL certificate pinning controls on an iOS banking app using Frida to intercept and analyse encrypted traffic.",
    "link": "",
    "status": "Confidential"
  },
  {
    "title": "Malware Analysis — Static and Dynamic Analysis",
    "category": "Blue Team",
    "tags": ["Malware Analysis", "DFIR", "PEView", "Sysinternals"],
    "date": "2024",
    "description": "Performed static (PEView, PEiD, VirusTotal) and dynamic (Process Hacker, Regshot, ApateDNS) analysis on a live malware sample in an isolated lab environment.",
    "link": "",
    "status": "University Project"
  },
  {
    "title": "Digital Forensics — Disk, Memory and Browser Artifact Analysis",
    "category": "Blue Team",
    "tags": ["DFIR", "Autopsy", "Volatility", "Memory Forensics"],
    "date": "2024",
    "description": "Full forensic investigation across disk images, memory captures, and browser artifacts using Autopsy, The Sleuth Kit, and Volatility Framework.",
    "link": "",
    "status": "University Project"
  }
];
