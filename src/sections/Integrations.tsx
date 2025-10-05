import Tag from "@/components/Tag";
import figmaIcon from "@/assets/images/figma-logo.svg";
import notionIcon from "@/assets/images/notion-logo.svg";
import slackIcon from "@/assets/images/slack-logo.svg";
import relumeIcon from "@/assets/images/relume-logo.svg";
import framerIcon from "@/assets/images/framer-logo.svg";
import githubIcon from "@/assets/images/github-logo.svg";
import IntegrationColumn from "@/components/IntegrationColumn";

const integrations = [
    {
        name: "Slack",
        icon: slackIcon,
        description:
            "Receive real-time uptime and performance alerts in your Slack channels.",
    },
    {
        name: "Notion",
        icon: notionIcon,
        description:
            "Log monitoring results and historical metrics directly into Notion databases.",
    },
    {
        name: "GitHub",
        icon: githubIcon,
        description:
            "Integrate Versa with your repositories to track uptime for project pages.",
    },
    {
        name: "Zapier",
        icon: relumeIcon,
        description:
            "Automate workflows and connect Versa with hundreds of other apps.",
    },
    {
        name: "Framer",
        icon: framerIcon,
        description:
            "Visualize website snapshots and performance data in Framer prototypes.",
    },
    {
        name: "Figma",
        icon: figmaIcon,
        description:
            "Embed dashboards and charts directly in Figma for team reporting.",
    },
];

export type IntegrationsType = typeof integrations;

export default function Integrations() {
    return (
        <section className="py-24 overflow-hidden">
            <div className="container">
                <div className="grid lg:grid-cols-2 items-center lg:gap-16">
                    <div>
                        <Tag>Integrations</Tag>
                        <h2 className="text-6xl font-medium mt-6">
                            Connect effortlessly with{" "}
                            <span className="text-lime-400">your tools</span>
                        </h2>

                        <p className="text-white/50 mt-4 text-lg">
                            Versa seamlessly integrates with popular platforms
                            so you can monitor, alert, and report across your
                            workflow.
                        </p>
                    </div>
                    <div>
                        <div className="grid md:grid-cols-2 gap-4 lg:h-[800px] h-[400px] lg:mt-0 mt-8 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                            <IntegrationColumn integrations={integrations} />
                            <IntegrationColumn
                                integrations={integrations.slice().reverse()}
                                className="hidden md:flex"
                                reverse
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
