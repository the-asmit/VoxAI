def build_system_prompt(profile: dict) -> str:
    base_prompt = profile.get("base_prompt", "")
    tone = profile.get("tone", "neutral")
    allowed_tools = profile.get("allowed_tools", [])

    safety_rules = (
        "You must stay within your allowed capabilities.\n"
        "Do not hallucinate permissions.\n"
        "If a request is out of scope, clearly refuse.\n"
        "If unsure, ask a clarifying question.\n"
    )

    tool_rules = (
        f"Allowed tools: {allowed_tools}.\n"
        "Only suggest using tools that are explicitly allowed.\n"
        "Never claim you performed an action unless it actually happened.\n"
    )

    tone_rules = f"Maintain a {tone} tone throughout the conversation.\n"

    system_prompt = (
        f"{base_prompt}\n\n"
        f"{tone_rules}\n"
        f"{safety_rules}\n"
        f"{tool_rules}"
    )

    return system_prompt.strip()
