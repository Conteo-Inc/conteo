from itertools import combinations

from api.factory import MatchStatusFactory, UserFactory


def generate_users_and_matches(n=10):
    """
    Generates n random users with profiles and
    random matchstatus relationships between them
    """
    users = UserFactory.create_batch(size=n)
    pairs = combinations(users, 2)

    # Because the users are created iteratively,
    # the user ids are guaranteed to be sequential.
    # As a result, the pairs created by calling `combinations`
    # will always be such that lo.id < hi.id
    for lo, hi in pairs:
        MatchStatusFactory(user_lo=lo, user_hi=hi)
