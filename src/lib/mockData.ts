export const MOCK_USER = {
  id: "mock_demo_boss",
  name: "Demo Admin",
  email: "admin@filefinder.in",
  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  role: "BOSS" as const,
  isPro: true,
  plan: "yearly",
  subscriptionStatus: "active",
};

export const MOCK_PARTIES = [
  { id: "p1", name: "Reliance Industries", colorId: "c_blue", colorName: "Blue", colorHex: "#3b82f6", notes: "Q3 Audit Files", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), userId: "mock_demo_boss", user: { name: "Demo Admin", email: "admin@filefinder.in" } },
  { id: "p2", name: "Tata Consultancy", colorId: "c_red", colorName: "Red", colorHex: "#ef4444", notes: "HR Records 2023", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), userId: "mock_demo_boss" },
  { id: "p3", name: "Infosys Branch 4", colorId: "c_green", colorName: "Green", colorHex: "#22c55e", notes: "Aarti's desk", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), userId: "u2", user: { name: "Rahul Verma" } },
  { id: "p4", name: "Adani Enterprises", colorId: "c_purple", colorName: "Purple", colorHex: "#a855f7", notes: "Compliance folder", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), userId: "mock_demo_boss" },
  { id: "p5", name: "Wipro Tech", colorId: "c_yellow", colorName: "Yellow", colorHex: "#eab308", notes: "Invoices pending", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), userId: "u3", user: { name: "Sneha Patel" } },
];

export const MOCK_USERS = [
  { id: "mock_demo_boss", name: "Demo Admin", email: "admin@filefinder.in", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", role: "BOSS", isPro: true, plan: "yearly", managerId: null, _count: { parties: 14, managedUsers: 3 } },
  { id: "u2", name: "Rahul Verma", email: "rahul@example.com", image: null, role: "MANAGER", isPro: false, plan: null, managerId: "mock_demo_boss", _count: { parties: 8, managedUsers: 2 } },
  { id: "u3", name: "Sneha Patel", email: "sneha@example.com", image: null, role: "STAFF", isPro: false, plan: null, managerId: "u2", _count: { parties: 3 } },
];

export const MOCK_AUDIT_LOGS = [
  { id: "l1", action: "CREATE_PARTY", target: "PartyFile", targetId: "p5", metadata: JSON.stringify({ name: "Wipro Tech", colorName: "Yellow" }), createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), user: { name: "Sneha Patel" } },
  { id: "l2", action: "LOGIN", target: "User", targetId: "mock_demo_boss", metadata: null, createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), user: { name: "Demo Admin" } },
  { id: "l3", action: "ROLE_CHANGE", target: "User", targetId: "u2", metadata: JSON.stringify({ before: { role: "STAFF" }, after: { role: "MANAGER" } }), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), user: { name: "Demo Admin" } },
];

export const MOCK_PAYMENTS = [
  { id: "pay_1", amount: 20000, plan: "yearly", status: "active", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() },
  { id: "pay_2", amount: 2000, plan: "monthly", status: "active", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString() },
];
