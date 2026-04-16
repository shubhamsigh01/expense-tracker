import { motion } from "motion/react";
import { User, Bell, Lock, CreditCard, Globe, HelpCircle } from "lucide-react";

const settingsSections = [
  {
    title: "Account",
    icon: User,
    items: [
      { label: "Profile Information", description: "Update your personal details" },
      { label: "Email Preferences", description: "Manage your email notifications" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Push Notifications", description: "Get alerts for expenses and budgets" },
      { label: "Weekly Reports", description: "Receive spending summaries via email" },
    ],
  },
  {
    title: "Security",
    icon: Lock,
    items: [
      { label: "Change Password", description: "Update your account password" },
      { label: "Two-Factor Authentication", description: "Add an extra layer of security" },
    ],
  },
  {
    title: "Billing",
    icon: CreditCard,
    items: [
      { label: "Subscription", description: "Manage your plan and billing" },
      { label: "Payment Methods", description: "Add or remove payment methods" },
    ],
  },
];

export function Settings() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-semibold mb-1" style={{ fontSize: "28px" }}>
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">{section.title}</h3>
            </div>
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-muted transition-colors text-left"
                >
                  <div>
                    <p className="font-medium mb-1">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <svg
                    className="w-5 h-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you with any questions or issues.
            </p>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
