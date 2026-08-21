import type { Country, Topic } from "@/components/simulator/types";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickExcluding<T>(arr: T[], exclude: T): T {
  const pool = arr.filter((v) => v !== exclude);
  return pool.length > 0 ? pick(pool) : arr[0];
}

export function buildOpeningStatement(country: Country, topic: Topic): string {
  const opener = pick(country.openers);
  const verb = pick(country.stanceVerbs);
  const issue1 = pick(topic.keyIssues);
  const priority = pick(country.priorities);
  const issue2 = pickExcluding(topic.keyIssues, issue1);
  const closer = pick(country.closers);

  const stance = `${country.formalName} ${verb} ${issue1}.`;
  const belief = `This delegation believes ${priority} must guide the committee's approach to ${issue2}.`;

  return [opener, stance, belief, closer].join(" ");
}

export function buildCaucusStatement(country: Country, topic: Topic): string {
  const verb = pick(country.stanceVerbs);
  const issue = pick(topic.keyIssues);
  const closer = pick(country.closers);
  const stance = `${country.formalName} ${verb} ${issue}.`;
  return [stance, closer].join(" ");
}

const POINT_TEMPLATES = [
  (askerName: string, issue: string, concern: string) =>
    `Given ${askerName}'s position on ${issue}, how does the delegate's proposal avoid ${concern}?`,
  (askerName: string, issue: string, concern: string) =>
    `Would the delegate clarify how their approach to ${issue} avoids ${concern}?`,
  (askerName: string, issue: string, concern: string) =>
    `${askerName} remains unconvinced — can the delegate explain how this avoids ${concern} with respect to ${issue}?`,
];

export function buildPointOfInquiry(asker: Country, topic: Topic): string {
  const issue = pick(topic.keyIssues);
  const concern = pick(topic.concerns);
  const template = pick(POINT_TEMPLATES);
  return template(asker.name, issue, concern);
}

const MOTION_TEMPLATES = [
  (time: number, duration: number, issue: string) =>
    `a moderated caucus on ${issue}, ${time} seconds per speaker, for a total of ${duration} minutes`,
  (time: number, duration: number, issue: string) =>
    `a moderated caucus to discuss ${issue}, ${time}-second speaking time, ${duration} minutes total`,
];

export function buildMotionText(topic: Topic, speakingTime: number, durationMinutes: number): string {
  const issue = pick(topic.keyIssues);
  const template = pick(MOTION_TEMPLATES);
  return template(speakingTime, durationMinutes, issue);
}
