import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Timeline from "@/components/ui/Timeline";

export const metadata: Metadata = {
  title: "Club History",
  description: "Nearly seven decades of shared enthusiasm, since 1957.",
};

export default function HistoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Since 1957"
        title="Club History"
        intro="From eleven enthusiasts at a farm near Oxford to a worldwide community of thousands."
        image="/images/car-silver-shadow.jpg"
      />

      <Timeline
        items={[
          {
            date: "1957",
            title: "It begins",
            body: "Following an advertisement in the Oxford Mail, eleven founding members meet at Paternoster Farm, Yarnton, and form the Rolls-Royce Enthusiasts' Club.",
          },
          {
            date: "1957",
            title: "First gathering",
            body: "Within a month of forming, the fledgling Club holds its first event — fourteen cars attend. The Bulletin, the Club's publication, is launched the same year.",
          },
          {
            date: "1960",
            title: "Growing fast",
            body: "Membership passes 100, and the Club widens its scope to welcome post-1931 Bentley motor cars alongside Rolls-Royce.",
          },
          {
            date: "1970",
            title: "Going international",
            body: "Membership reaches 1,500, including 300 members overseas across 37 countries, supported by 18 Sections across the UK and Europe.",
          },
          {
            date: "1976–77",
            title: "A lasting legacy",
            body: "The Sir Henry Royce Memorial Foundation is formed as a charitable trust and acquires The Hunt House in Paulerspury as its archive and headquarters.",
          },
          {
            date: "1977",
            title: "Windsor Castle",
            body: "More than 400 pre- and post-war Rolls-Royce and Bentley motor cars parade at Windsor Castle for the Queen's Silver Jubilee.",
          },
          {
            date: "Late 1990s",
            title: "Going online",
            body: "The Club launches its website as worldwide membership passes 9,000, and Model Registers are introduced.",
          },
          {
            date: "2002 & 2007",
            title: "Two Jubilees",
            body: "550 cars return to Windsor for the Queen's Golden Jubilee in 2002; in 2007 the Club celebrates its own Golden Jubilee — fifty years since Yarnton.",
          },
          {
            date: "2011",
            title: "A royal 90th",
            body: "More than 100 cars take part in celebrations for the Duke of Edinburgh's 90th birthday.",
          },
          {
            date: "2017",
            title: "Diamond anniversary",
            body: "The Club marks 60 years with a Round Britain Tour of 52 vehicles, including sixteen Silver Ghosts.",
          },
          {
            date: "Today",
            title: "Worldwide",
            body: "The community continues to celebrate Rolls-Royce and Bentley through 18 UK and 18 international Sections, events, knowledge and friendship — now joined by the Historic & Classic Vehicles Alliance.",
          },
        ]}
      />
    </>
  );
}
