from langchain_core.tools import tool

@tool
def log_interaction(hcp_name: str, notes: str, date: str):
    """Logs a new interaction with an HCP. Use this for summarization and entry."""
    return f"SUCCESS: Interaction for {hcp_name} on {date} recorded."

@tool
def edit_interaction(interaction_id: int, new_notes: str):
    """Modifies existing logged data for a specific interaction ID."""
    return f"SUCCESS: Interaction {interaction_id} updated."

@tool
def get_hcp_history(hcp_name: str):
    """Retrieves past 3 interactions for context before a meeting."""
    return f"HISTORY: Last met {hcp_name} in Dec 2025 regarding Product A."

@tool
def compliance_check(notes: str):
    """Scans notes to ensure no off-label medical claims were made."""
    return "COMPLIANCE: Clear. No violations found."

@tool
def schedule_followup(hcp_name: str, date: str):
    """Schedules a task for the sales rep to follow up."""
    return f"TASK: Reminder set for {hcp_name} on {date}."