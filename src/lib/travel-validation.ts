export function text(
  value: unknown,
  min: number,
  max: number,
  label: string
) {
  if (
    typeof value !== "string" ||
    value.trim().length < min ||
    value.trim().length > max
  ) {
    throw new Error(`${label} must be ${min}–${max} characters.`);
  }
  return value.trim();
}

export function choice(value: unknown, options: string[], label: string) {
  if (typeof value !== "string" || !options.includes(value)) {
    throw new Error(`Choose a valid ${label}.`);
  }
  return value;
}

export function emailAddress(value: unknown) {
  const email = text(value, 5, 200, "Email").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }
  return email;
}

export function preferences(input: Record<string, unknown>) {
  const duration = Number(input.duration);
  const travellers = Number(input.travellers || 1);
  if (![3, 5, 7, 10, 14].includes(duration)) {
    throw new Error("Choose a supported trip duration.");
  }
  if (!Number.isInteger(travellers) || travellers < 1 || travellers > 12) {
    throw new Error("Choose 1–12 travellers.");
  }
  return {
    duration,
    travellers,
    style: choice(
      input.style,
      ["Adventure", "Relaxation", "Family", "Culture"],
      "travel style"
    ) as "Adventure" | "Relaxation" | "Family" | "Culture",
    budget: choice(
      input.budget,
      ["All Budget", "Budget friendly", "Comfortable", "Luxury"],
      "budget"
    ) as "All Budget" | "Budget friendly" | "Comfortable" | "Luxury",
    interests: choice(
      input.interests,
      ["Nature & Culture", "Beach & Relaxation", "Wildlife", "Heritage"],
      "interest"
    ) as "Nature & Culture" | "Beach & Relaxation" | "Wildlife" | "Heritage",
    season: choice(
      input.season || "Flexible",
      [
        "Flexible",
        "December – March",
        "April – June",
        "July – September",
        "October – November",
      ],
      "season"
    ) as
      | "Flexible"
      | "December – March"
      | "April – June"
      | "July – September"
      | "October – November",
    startingPoint: choice(
      input.startingPoint || "Colombo",
      ["Colombo", "Kandy", "Galle", "Ella"],
      "starting point"
    ) as "Colombo" | "Kandy" | "Galle" | "Ella",
  };
}
