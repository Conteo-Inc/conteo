from itertools import combinations

from api.factory import MatchStatusFactory, UserFactory


def generate_users_and_matches():
    """
    Generates 5 random users with profiles and
    random matchstatus relationships between them
    """
    users = UserFactory.create_batch(size=5)
    pairs = combinations(users, 2)

    for lo, hi in pairs:
        MatchStatusFactory(user_lo=lo, user_hi=hi)
