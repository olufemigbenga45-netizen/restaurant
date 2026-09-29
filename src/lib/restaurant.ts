export const RESTAURANT = {
  name: "G-Bite's",
  tagline: "Nigerian kitchen & grill",
  phone: "0704 166 3145",
  phoneHref: "+2347041663145",
  email: "hello@gbites.ng",
  address: "Ogun State, Nigeria",
  shortAddress: "Ogun State",
  mapUrl: "https://maps.google.com/?q=Ogun+State+Nigeria",
  story:
    "G-Bite's is an authentic Nigerian kitchen built around one simple idea: cook it the way it's meant to be cooked — over open fire, with patience and plenty of spice.",
  hours: [
    { day: "Monday", time: "10:00 am – 10:00 pm" },
    { day: "Tuesday", time: "10:00 am – 10:00 pm" },
    { day: "Wednesday", time: "10:00 am – 10:00 pm" },
    { day: "Thursday", time: "10:00 am – 10:00 pm" },
    { day: "Friday", time: "10:00 am – 11:00 pm" },
    { day: "Saturday", time: "9:00 am – 11:00 pm" },
    { day: "Sunday", time: "12:00 pm – 10:00 pm" },
  ],
} as const;

export const TIME_SLOTS = [
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

export const SEATING_OPTIONS = [
  { value: "dining-room", label: "Main dining room" },
  { value: "patio", label: "Open-air patio" },
  { value: "chef-counter", label: "Grill-side counter" },
  { value: "bar", label: "Lounge & drinks" },
  { value: "private-room", label: "Private party room" },
] as const;

export const OCCASIONS = [
  "None",
  "Birthday",
  "Anniversary",
  "Business dinner",
  "Family gathering",
  "Celebration",
] as const;

export const DIETARY_FILTERS = [
  { value: "spicy", label: "Spicy" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "signature", label: "Chef's picks" },
] as const;

export const TAX_RATE = 0.075;
export const DELIVERY_FEE = 1500;

export function formatMoney(naira: number) {
  return `₦${naira.toLocaleString("en-NG")}`;
}

export function formatSlotTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatDateLong(date: string) {
  const d = new Date(`${date}T12:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
