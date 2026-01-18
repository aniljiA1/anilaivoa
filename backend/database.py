import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

# If on Render, use the cloud URL; otherwise, use your local MySQL
if not DATABASE_URL:
    DATABASE_URL = "mysql+pymysql://root:Anil%40123@127.0.0.1:3306/hcp_db"

# Added connect_args to handle the 'ssl-mode=REQUIRED' from Aiven
engine = create_engine(
    DATABASE_URL,
    connect_args={"ssl": {"ca": "/etc/ssl/certs/ca-certificates.crt"}} if "render" in os.environ.get("RENDER_EXTERNAL_HOSTNAME", "") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
