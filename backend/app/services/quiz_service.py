import random
from app.services import countries_service
from app.schemas import QuizQuestion


async def generate_questions(count: int = 10) -> list[QuizQuestion]:
    all_countries = await countries_service.get_all()
    # Filter countries that have a usable flag SVG
    valid = [c for c in all_countries if c.get("flags", {}).get("svg")]
    if len(valid) < 4:
        return []

    count = min(count, len(valid))
    selected = random.sample(valid, count)
    questions: list[QuizQuestion] = []

    for country in selected:
        correct_name = country["name"]["common"]
        wrong_pool = [c["name"]["common"] for c in valid if c["name"]["common"] != correct_name]
        wrong = random.sample(wrong_pool, 3)
        options = wrong + [correct_name]
        random.shuffle(options)
        questions.append(
            QuizQuestion(
                country_code=country["cca3"],
                flag_url=country["flags"]["svg"],
                options=options,
                answer=correct_name,
            )
        )

    return questions
