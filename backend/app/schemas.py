"""
The shapes of data going in and out of the API (what the front end sends and receives).

Pydantic checks every incoming request against these shapes. If something is
wrong (bad campus, non-UCL email...) FastAPI answers 422 with a clear message
before our own code runs.
"""

from typing import Annotated, List, Literal, Optional

from pydantic import BaseModel, Field, field_validator

# The allowed values for the fixed-choice answers.
Campus = Literal["main", "canary", "both"]
AlcoholPref = Literal["drinks", "bars_no_drink", "avoid"]
Goal = Literal["career", "social", "both"]

# A short piece of text with no stray spaces at the ends.
ShortText = Annotated[str, Field(min_length=1, max_length=100)]

MAX_TAGS = 8


def check_ucl_email(value: str) -> str:
    """Lower-case the email and make sure it is a UCL one."""
    value = value.strip().lower()
    name, _, domain = value.partition("@")
    if not name or domain != "ucl.ac.uk":
        raise ValueError("Please use your UCL email address (ending in @ucl.ac.uk).")
    return value


class RegisterIn(BaseModel):
    """Everything sent when a student creates an account (account fields + questionnaire answers)."""

    name: str = Field(min_length=1, max_length=100)
    ucl_email: str
    # bcrypt only looks at the first 72 bytes, so we cap the length.
    password: str = Field(min_length=8, max_length=72)

    campus: Campus
    travel_ok: bool = False
    alcohol_pref: AlcoholPref
    goal: Goal
    course: Optional[str] = Field(default=None, max_length=100)
    year: Optional[int] = Field(default=None, ge=1, le=5)  # 1-4 undergraduate, 5 = postgraduate
    experience_industry: List[ShortText] = Field(default_factory=list, max_length=10)
    experience_note: Optional[str] = Field(default=None, max_length=500)  # display only
    availability: List[ShortText] = Field(default_factory=list, max_length=10)
    linkedin_url: Optional[str] = Field(default=None, max_length=200)
    linkedin_max_optin: bool = False

    tag_ids: List[int] = Field(default_factory=list, max_length=MAX_TAGS)
    looking_for: List[ShortText] = Field(default_factory=list, max_length=10)
    offers: List[ShortText] = Field(default_factory=list, max_length=10)

    @field_validator("ucl_email")
    @classmethod
    def email_must_be_ucl(cls, value):
        return check_ucl_email(value)


class LoginIn(BaseModel):
    ucl_email: str
    password: str

    @field_validator("ucl_email")
    @classmethod
    def tidy_email(cls, value):
        return value.strip().lower()


class PreferencesIn(BaseModel):
    """Fields a student can change later. Anything left out stays as it was."""

    campus: Optional[Campus] = None
    travel_ok: Optional[bool] = None
    alcohol_pref: Optional[AlcoholPref] = None
    goal: Optional[Goal] = None
    linkedin_max_optin: Optional[bool] = None
    linkedin_url: Optional[str] = Field(default=None, max_length=200)


class ProfileOut(BaseModel):
    """A student's own profile. There is deliberately no password or hash here."""

    id: int
    name: str
    ucl_email: str
    campus: str
    travel_ok: bool
    alcohol_pref: str
    goal: str
    course: Optional[str]
    year: Optional[int]
    experience_industry: list
    experience_note: Optional[str]
    availability: list
    linkedin_url: Optional[str]
    linkedin_max_optin: bool
    tags: List[str]  # tag names
    looking_for: List[str]
    offers: List[str]


class RegisterOut(BaseModel):
    user: ProfileOut
    token: str


class TokenOut(BaseModel):
    token: str
