def is_tool_allowed(tool_name: str, allowed_tools: list[str]) -> bool:
    if not tool_name:
        return False

    return tool_name in allowed_tools


def enforce_policy(decision: str, allowed_tools: list[str]) -> str:
    """
    decision can be:
    - respond_only
    - refuse
    - use_tool:<tool_name>
    """

    if decision == "respond_only":
        return decision

    if decision == "refuse":
        return decision

    if decision.startswith("use_tool:"):
        tool_name = decision.split("use_tool:", 1)[1].strip()

        if is_tool_allowed(tool_name, allowed_tools):
            return decision

        # Tool requested but not allowed
        return "respond_only"

    # Fallback safety
    return "respond_only"
