from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate

from app.agent.llm import (
    call_llm_safe,
    get_fallback_intent,
    get_fallback_decision,
    get_fallback_response
)

load_dotenv()


async def intent_node(state: dict) -> dict:
    """Classify user intent, with language awareness."""
    language = state.get("language", "en")
    
    language_instructions = {
        "en": "Identify the user's intent in ONE short sentence.",
        "es": "Identifica la intención del usuario en UNA frase corta.",
        "fr": "Identifiez l'intention de l'utilisateur en UNE phrase courte.",
        "de": "Identifizieren Sie die Absicht des Benutzers in EINEM kurzen Satz.",
        "it": "Identifica l'intenzione dell'utente in UNA frase breve.",
        "pt": "Identifique a intenção do usuário em UMA frase curta.",
        "ja": "ユーザーの意図を1つの短い文で識別します。",
        "zh": "用一句话识别用户的意图。",
        "ko": "사용자의 의도를 한 문장으로 식별하세요.",
        "ru": "Определите намерение пользователя в ОДНОМ коротком предложении.",
    }
    
    instruction = language_instructions.get(language, language_instructions["en"])
    
    prompt = ChatPromptTemplate.from_template(
        """
You are an intent classifier.

User input:
{user_input}

{instruction}
Do not suggest actions.
"""
    )

    intent = await call_llm_safe(
        prompt.format(
            user_input=state["user_input"],
            instruction=instruction
        )
    )

    # Use fallback if LLM fails
    if intent is None:
        intent = get_fallback_intent(state["user_input"])

    state["intent"] = intent.strip()
    return state


async def decision_node(state: dict) -> dict:
    """Decide whether to respond, refuse, or use a tool. Language-aware."""
    language = state.get("language", "en")
    
    language_instructions = {
        "en": "Decide ONE option only:\n- respond_only\n- refuse\n- use_tool:<tool_name>\n\nOutput ONLY the decision.",
        "es": "Elige UNA opción:\n- respond_only\n- refuse\n- use_tool:<tool_name>\n\nSolo genera la decisión.",
        "fr": "Choisissez UNE option:\n- respond_only\n- refuse\n- use_tool:<tool_name>\n\nSortie UNIQUEMENT la décision.",
        "de": "Wählen Sie EINE Option:\n- respond_only\n- refuse\n- use_tool:<tool_name>\n\nGeben Sie NUR die Entscheidung aus.",
        "it": "Scegli UNA opzione:\n- respond_only\n- refuse\n- use_tool:<tool_name>\n\nEsci SOLO la decisione.",
        "pt": "Escolha UMA opção:\n- respond_only\n- refuse\n- use_tool:<tool_name>\n\nSaída APENAS a decisão.",
        "ja": "オプションを1つ選択:\n- respond_only\n- refuse\n- use_tool:<tool_name>\n\n決定のみを出力します。",
        "zh": "选择一个选项:\n- respond_only\n- refuse\n- use_tool:<tool_name>\n\n仅输出决策。",
        "ko": "옵션 1개 선택:\n- respond_only\n- refuse\n- use_tool:<tool_name>\n\n결정만 출력하세요.",
        "ru": "Выберите ОДИН вариант:\n- respond_only\n- refuse\n- use_tool:<tool_name>\n\nВЫВОДИТЕ ТОЛЬКО решение.",
    }
    
    instruction = language_instructions.get(language, language_instructions["en"])
    
    prompt = ChatPromptTemplate.from_template(
        """
User intent:
{intent}

Allowed tools:
{allowed_tools}

{instruction}
"""
    )

    decision = await call_llm_safe(
        prompt.format(
            intent=state["intent"],
            allowed_tools=state.get("allowed_tools", []),
            instruction=instruction
        )
    )

    # Use fallback if LLM fails
    if decision is None:
        decision = get_fallback_decision()

    state["decision"] = decision.strip()
    return state


async def response_node(state: dict) -> dict:
    """Generate response with language-aware instructions."""
    language = state.get("language", "en")
    
    language_instructions = {
        "en": "Respond naturally and concisely in English.",
        "es": "Responde de forma natural y concisa en español.",
        "fr": "Répondez naturellement et de manière concise en français.",
        "de": "Antworten Sie natürlich und prägnant auf Deutsch.",
        "it": "Rispondi naturalmente e brevemente in italiano.",
        "pt": "Responda de forma natural e concisa em português.",
        "ja": "日本語で自然かつ簡潔に回答してください。",
        "zh": "用中文自然而简洁地回答。",
        "ko": "한국어로 자연스럽고 간결하게 응답하세요.",
        "ru": "Отвечайте естественно и кратко на русском языке.",
    }
    
    instruction = language_instructions.get(language, language_instructions["en"])
    
    prompt = ChatPromptTemplate.from_template(
        """
System behavior:
{system_prompt}

Decision:
{decision}

User said:
{user_input}

{instruction}
"""
    )

    response = await call_llm_safe(
        prompt.format(
            system_prompt=state["system_prompt"],
            decision=state["decision"],
            user_input=state["user_input"],
            instruction=instruction
        )
    )

    # Use fallback if LLM fails
    if response is None:
        response = get_fallback_response(state["user_input"])

    state["final_response"] = response.strip()
    return state
