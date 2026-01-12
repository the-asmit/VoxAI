from langgraph.graph import StateGraph, END
from app.agent.nodes import intent_node, decision_node, response_node


def build_agent_graph():
    graph = StateGraph(dict)

    graph.add_node("intent", intent_node)
    graph.add_node("decision", decision_node)
    graph.add_node("response", response_node)

    graph.set_entry_point("intent")

    graph.add_edge("intent", "decision")
    graph.add_edge("decision", "response")
    graph.add_edge("response", END)

    return graph.compile()
