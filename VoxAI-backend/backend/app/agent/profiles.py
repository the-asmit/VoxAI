def get_government_profile():
    return {
        "name": "Government Helpline",
        "tone": "formal",
        "allowed_tools": ["generate_pdf", "send_email"],
        "base_prompt": (
            "You are a formal government helpline voice agent. "
            "Provide accurate information, do not make promises, "
            "and refuse requests outside policy."
        ),
    }


def get_private_profile():
    return {
        "name": "Private Company Support",
        "tone": "professional",
        "allowed_tools": ["send_email"],
        "base_prompt": (
            "You are a professional customer support voice agent for a private company. "
            "Be polite, efficient, and solution-oriented."
        ),
    }


def build_custom_profile(system_prompt: str, allowed_tools: list[str]):
    return {
        "name": "Custom Agent",
        "tone": "neutral",
        "allowed_tools": allowed_tools,
        "base_prompt": system_prompt,
    }


def load_profile(profile_type: str, custom_config: dict | None = None):
    if profile_type == "government":
        return get_government_profile()

    if profile_type == "private":
        return get_private_profile()

    if profile_type == "custom" and custom_config:
        return build_custom_profile(
            system_prompt=custom_config.get("system_prompt", ""),
            allowed_tools=custom_config.get("allowed_tools", []),
        )

    raise ValueError("Invalid agent profile")
