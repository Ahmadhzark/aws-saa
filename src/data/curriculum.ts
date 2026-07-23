// Canonical AWS Certified Solutions Architect – Associate (SAA-C03) curriculum —
// the single source of truth for the app. Weeks are DERIVED from START so the
// schedule can't drift. User progress is stored separately, keyed by these ids.
//
// ⚠️ REVIEW FOR ACCURACY: the topic list and exam-angle blurbs are a study aid,
// not official AWS material. Verify against the current SAA-C03 exam guide.

import type { Domain, Lab, Topic, Week } from "./types";

export const START = "2026-07-27";
export const EXAM = "2026-10-31"; // end of week 14
export const TOTAL_LABS = 120;
export const TOTAL_HOURS = 120;

// Official SAA-C03 domain weights.
export const DOMAINS: Domain[] = [
  { id: "1.0", name: "Secure Architectures", weight: 30, order: 1 },
  { id: "2.0", name: "Resilient Architectures", weight: 26, order: 2 },
  { id: "3.0", name: "High-Performing Architectures", weight: 24, order: 3 },
  { id: "4.0", name: "Cost-Optimized Architectures", weight: 20, order: 4 },
];

const WEEK_FOCUS = [
  "Cloud & IAM Foundations", "Networking: VPC Core", "Compute: EC2 & Auto Scaling",
  "Load Balancing & DNS", "Storage: S3, EBS & EFS", "Databases: RDS, Aurora & DynamoDB",
  "Security & Encryption", "Resilience & Disaster Recovery", "Decoupling: SQS/SNS/EventBridge",
  "Serverless: Lambda & API Gateway", "Performance & Caching", "Monitoring & Governance",
  "Cost Optimization", "Review & Mock Exams",
];

// `blurb` = the exam angle: the thing most likely tested, or the classic trap.
const RAW_TOPICS: Omit<Topic, "domainId">[] = [
  // Domain 1 — Secure Architectures (30%)
  { id: "1.1", name: "IAM Users, Groups, Roles & Policies", hours: 3, week: 1, blurb: "Prefer roles + temporary credentials over long-lived access keys — that's the constant right answer." },
  { id: "1.2", name: "IAM Policy Evaluation & Permission Boundaries", hours: 3, week: 1, blurb: "Evaluation order: explicit deny beats allow beats implicit deny. Boundaries cap permissions, they never grant." },
  { id: "1.3", name: "AWS Organizations & SCPs", hours: 2, week: 12, blurb: "SCPs set the maximum permissions for accounts; on their own they never grant access." },
  { id: "1.4", name: "IAM Identity Center & Federation", hours: 3, week: 1, blurb: "For workforce SSO and temporary creds, federate — don't create an IAM user per person." },
  { id: "1.5", name: "KMS & Envelope Encryption", hours: 3, week: 7, blurb: "KMS encrypts the data key, not your data directly. Know customer-managed vs AWS-managed keys." },
  { id: "1.6", name: "Encryption in Transit & at Rest", hours: 2, week: 7, blurb: "Default to SSE-KMS on S3 and TLS everywhere; know which services encrypt by default." },
  { id: "1.7", name: "Secrets Manager vs SSM Parameter Store", hours: 2, week: 7, blurb: "Secrets Manager auto-rotates credentials; Parameter Store is cheaper for plain config." },
  { id: "1.8", name: "Security Groups vs Network ACLs", hours: 3, week: 2, blurb: "SGs are stateful and allow-only; NACLs are stateless and can explicitly deny." },
  { id: "1.9", name: "WAF, Shield & Firewall Manager", hours: 2, week: 7, blurb: "WAF filters L7; Shield handles DDoS; Shield Advanced adds cost protection and a response team." },
  { id: "1.10", name: "GuardDuty, Inspector & Macie", hours: 2, week: 12, blurb: "GuardDuty = threat detection from logs, Inspector = vulnerability scans, Macie = sensitive data in S3." },
  { id: "1.11", name: "Certificate Manager & TLS", hours: 2, week: 4, blurb: "ACM public certs are free and auto-renew — but only on integrated endpoints like ELB and CloudFront." },
  { id: "1.12", name: "S3 Access Control & Block Public Access", hours: 3, week: 5, blurb: "Block Public Access overrides bucket policies — the classic 'why is it still private' trap." },
  { id: "1.13", name: "VPC Endpoints & PrivateLink", hours: 3, week: 2, blurb: "Gateway endpoints (S3/DynamoDB) are free routes; interface endpoints are billable ENIs." },

  // Domain 2 — Resilient Architectures (26%)
  { id: "2.1", name: "Regions, AZs & Edge Locations", hours: 2, week: 1, blurb: "Multi-AZ is HA within a Region; multi-Region is DR/latency. Never conflate the two." },
  { id: "2.2", name: "EC2 Auto Scaling Groups", hours: 3, week: 3, blurb: "Health checks + desired capacity self-heal; know the difference between EC2 and ELB health checks." },
  { id: "2.3", name: "Elastic Load Balancing (ALB/NLB/GWLB)", hours: 3, week: 4, blurb: "ALB = HTTP L7 routing, NLB = TCP/UDP + static IP + ultra-low latency, GWLB = inline appliances." },
  { id: "2.4", name: "RDS Multi-AZ vs Read Replicas", hours: 3, week: 6, blurb: "Multi-AZ = synchronous standby for failover (HA); read replicas = async read scaling (not failover)." },
  { id: "2.5", name: "Aurora Architecture & Global Database", hours: 3, week: 6, blurb: "Storage is 6-way replicated across 3 AZs; Global Database gives cross-Region DR with ~1s lag." },
  { id: "2.6", name: "DynamoDB Global Tables & Backups", hours: 2, week: 6, blurb: "Global Tables = multi-Region active-active; point-in-time recovery for continuous backup." },
  { id: "2.7", name: "S3 Durability, Versioning & Replication", hours: 2, week: 5, blurb: "Eleven 9s of durability; versioning + CRR/SRR for protection, compliance and latency." },
  { id: "2.8", name: "Backup & Disaster Recovery Strategies", hours: 3, week: 8, blurb: "Know the four DR patterns by RTO/RPO: backup-restore, pilot light, warm standby, multi-site active-active." },
  { id: "2.9", name: "Route 53 Routing & Health Checks", hours: 3, week: 4, blurb: "Failover routing + health checks give DNS-level HA; know latency vs geolocation vs weighted." },
  { id: "2.10", name: "SQS for Decoupling & Resilience", hours: 3, week: 9, blurb: "A queue absorbs spikes and decouples producers from consumers; visibility timeout prevents double-processing." },
  { id: "2.11", name: "Multi-AZ Design Patterns", hours: 2, week: 8, blurb: "Spread subnets and instances across ≥2 AZs — a single-AZ design is an automatic wrong answer." },

  // Domain 3 — High-Performing Architectures (24%)
  { id: "3.1", name: "EC2 Instance Types & Placement Groups", hours: 3, week: 3, blurb: "Match the family to the workload; cluster placement for low-latency HPC, spread for HA." },
  { id: "3.2", name: "EBS Volume Types & Performance", hours: 3, week: 5, blurb: "gp3 decouples IOPS from size; io2 for high-durability databases. Know IOPS vs throughput." },
  { id: "3.3", name: "EFS vs FSx vs Instance Store", hours: 2, week: 5, blurb: "EFS = shared multi-AZ NFS; FSx for Windows/Lustre; instance store = ephemeral but fastest." },
  { id: "3.4", name: "S3 Performance & Storage Classes", hours: 2, week: 5, blurb: "S3 scales automatically; use multipart upload and Transfer Acceleration for large/distant objects." },
  { id: "3.5", name: "CloudFront & Edge Caching", hours: 3, week: 11, blurb: "Caches at the edge; use Origin Access Control to lock an S3 origin to CloudFront only." },
  { id: "3.6", name: "ElastiCache (Redis vs Memcached)", hours: 2, week: 11, blurb: "Redis for persistence/replication/pub-sub; Memcached for simple, horizontally-scaled caching." },
  { id: "3.7", name: "DynamoDB Performance & DAX", hours: 3, week: 6, blurb: "Partition-key design drives throughput; DAX gives microsecond reads for hot items." },
  { id: "3.8", name: "Read Replicas & Caching for Databases", hours: 2, week: 11, blurb: "Offload reads to replicas and cache hot queries — writes still go to the primary." },
  { id: "3.9", name: "Kinesis & Data Streaming", hours: 3, week: 9, blurb: "Data Streams for real-time custom processing; Firehose for near-real-time load to S3/Redshift." },
  { id: "3.10", name: "Global Accelerator vs CloudFront", hours: 2, week: 11, blurb: "Global Accelerator = static anycast IPs over the AWS backbone for TCP/UDP; CloudFront = HTTP caching." },
  { id: "3.11", name: "Lambda & API Gateway Performance", hours: 3, week: 10, blurb: "Mind cold starts, concurrency limits and payload/timeout ceilings; provisioned concurrency smooths latency." },

  // Domain 4 — Cost-Optimized Architectures (20%)
  { id: "4.1", name: "EC2 Pricing: On-Demand/Reserved/Spot/Savings Plans", hours: 3, week: 13, blurb: "Spot for interruptible work, Savings Plans/RIs for steady state; Spot can be reclaimed in 2 minutes." },
  { id: "4.2", name: "S3 Storage Classes & Lifecycle Policies", hours: 3, week: 13, blurb: "Transition to IA/Glacier by age with lifecycle rules; Intelligent-Tiering when access is unpredictable." },
  { id: "4.3", name: "Intelligent-Tiering & Glacier Retrieval", hours: 2, week: 13, blurb: "Glacier retrieval tiers trade cost for speed: expedited, standard, bulk. Know the time ranges." },
  { id: "4.4", name: "Right-Sizing & Compute Optimizer", hours: 2, week: 13, blurb: "Compute Optimizer recommends instance right-sizing from CloudWatch metrics." },
  { id: "4.5", name: "Cost Explorer, Budgets & Anomaly Detection", hours: 2, week: 13, blurb: "Budgets alert on thresholds, Cost Explorer analyzes trends, tags drive cost allocation." },
  { id: "4.6", name: "Data Transfer Costs", hours: 2, week: 13, blurb: "Internet egress and cross-AZ/Region transfer cost money; same-AZ and in-Region to S3 is often free." },
  { id: "4.7", name: "Storage & Database Cost Optimization", hours: 2, week: 13, blurb: "Aurora Serverless v2 and DynamoDB on-demand match spend to usage for spiky workloads." },
  { id: "4.8", name: "Serverless & Managed Services for Cost", hours: 2, week: 10, blurb: "Pay-per-use (Lambda, Fargate, S3) removes idle cost; managed services cut operational overhead." },
  { id: "4.9", name: "Tagging, Consolidated Billing & Organizations", hours: 2, week: 12, blurb: "Consolidated billing pools usage for volume discounts; tags power cost-allocation reports." },
];

export const LABS: Lab[] = [
  { id: "L001", name: "Create an IAM user, group and least-privilege policy", difficulty: "E", minutes: 20, tech: "IAM", week: 1, topic: "1.1" },
  { id: "L002", name: "Assume an IAM role via STS from the CLI", difficulty: "M", minutes: 30, tech: "IAM, STS", week: 1, topic: "1.1" },
  { id: "L003", name: "Attach a permissions boundary and test its cap", difficulty: "M", minutes: 30, tech: "IAM", week: 1, topic: "1.2" },
  { id: "L004", name: "Enable MFA and enforce it with a policy", difficulty: "M", minutes: 25, tech: "IAM, MFA", week: 1, topic: "1.1" },
  { id: "L005", name: "Build a VPC with public and private subnets + route tables", difficulty: "M", minutes: 45, tech: "VPC, subnets", week: 2, topic: "1.8" },
  { id: "L006", name: "Configure an Internet Gateway and NAT Gateway", difficulty: "M", minutes: 35, tech: "VPC, NAT", week: 2, topic: "1.8" },
  { id: "L007", name: "Set up Security Groups and Network ACLs", difficulty: "E", minutes: 30, tech: "SG, NACL", week: 2, topic: "1.8" },
  { id: "L008", name: "Create an S3 Gateway VPC endpoint", difficulty: "M", minutes: 25, tech: "VPC endpoint, S3", week: 2, topic: "1.13" },
  { id: "L009", name: "Launch EC2 and connect via SSM Session Manager", difficulty: "E", minutes: 25, tech: "EC2, SSM", week: 3, topic: "3.1" },
  { id: "L010", name: "Create a launch template and Auto Scaling Group", difficulty: "M", minutes: 40, tech: "ASG, EC2", week: 3, topic: "2.2" },
  { id: "L011", name: "Configure an Application Load Balancer with target groups", difficulty: "M", minutes: 40, tech: "ALB", week: 4, topic: "2.3" },
  { id: "L012", name: "Set up Route 53 failover routing with health checks", difficulty: "H", minutes: 45, tech: "Route 53", week: 4, topic: "2.9" },
  { id: "L013", name: "Create an S3 bucket with versioning and lifecycle rules", difficulty: "E", minutes: 30, tech: "S3", week: 5, topic: "4.2" },
  { id: "L014", name: "Enable S3 default encryption with SSE-KMS", difficulty: "E", minutes: 25, tech: "S3, KMS", week: 5, topic: "1.6" },
  { id: "L015", name: "Configure S3 Cross-Region Replication", difficulty: "M", minutes: 35, tech: "S3 CRR", week: 5, topic: "2.7" },
  { id: "L016", name: "Attach and resize a gp3 EBS volume", difficulty: "E", minutes: 25, tech: "EBS", week: 5, topic: "3.2" },
  { id: "L017", name: "Create a Multi-AZ RDS instance and force a failover", difficulty: "M", minutes: 40, tech: "RDS", week: 6, topic: "2.4" },
  { id: "L018", name: "Add an RDS read replica and route reads to it", difficulty: "M", minutes: 35, tech: "RDS", week: 6, topic: "2.4" },
  { id: "L019", name: "Create a DynamoDB table with on-demand capacity", difficulty: "E", minutes: 30, tech: "DynamoDB", week: 6, topic: "3.7" },
  { id: "L020", name: "Create a KMS customer-managed key and encrypt data", difficulty: "M", minutes: 30, tech: "KMS", week: 7, topic: "1.5" },
  { id: "L021", name: "Store and rotate a secret in Secrets Manager", difficulty: "M", minutes: 30, tech: "Secrets Manager", week: 7, topic: "1.7" },
  { id: "L022", name: "Decouple an app with an SQS queue", difficulty: "M", minutes: 35, tech: "SQS", week: 9, topic: "2.10" },
  { id: "L023", name: "Fan out events with SNS to multiple SQS queues", difficulty: "H", minutes: 40, tech: "SNS, SQS", week: 9, topic: "2.10" },
  { id: "L024", name: "Build a serverless API with Lambda + API Gateway", difficulty: "H", minutes: 50, tech: "Lambda, API Gateway", week: 10, topic: "3.11" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function shiftDate(iso: string, days: number): string {
  const d = new Date(Date.parse(iso + "T00:00:00Z") + days * 86400000);
  return d.toISOString().slice(0, 10);
}

function pretty(iso: string): string {
  const d = new Date(Date.parse(iso + "T00:00:00Z"));
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function domainOf(topicId: string): string {
  return topicId.split(".")[0] + ".0";
}

export const TOTAL_WEEKS = WEEK_FOCUS.length;

export const TOPICS: Topic[] = RAW_TOPICS.map((t) => ({ ...t, domainId: domainOf(t.id) }));

export const WEEKS: Week[] = WEEK_FOCUS.map((focus, i) => {
  const id = i + 1;
  const starts = shiftDate(START, i * 7);
  const ends = id === TOTAL_WEEKS ? EXAM : shiftDate(starts, 6);
  return { id, focus, starts, ends, label: `${pretty(starts)} – ${pretty(ends)}` };
});

export const TOTAL_TOPICS = TOPICS.length;
