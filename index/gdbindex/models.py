from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Dataset(Base):
    __tablename__ = 'dataset'
    id = Column(Integer, primary_key=True)
    title =  Column(String)
    category =  Column(String)
    calc_kind =  Column(String)

    def __repr__(self):
        return '[{category}] {title}'.format(
            category=self.category,
            title=self.title
        ) 

class Datapoint(Base):
    __tablename__ = 'datapoint'
    id = Column(Integer, primary_key=True)

    year =  Column(Integer)
    value =  Column(Float)
    source = Column(String, nullable=True)
    source_url = Column(String, nullable=True)

    dataset_id =  Column(Integer, ForeignKey('dataset.id'))
    dataset = relationship(Dataset, primaryjoin=dataset_id == Dataset.id)

def init(engine):
    Base.metadata.create_all(engine)