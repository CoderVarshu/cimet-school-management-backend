import app from "../index.js";
import School from "../models/School.js";
import mongoose from "mongoose";
import request from "supertest";
import dotenv from 'dotenv';
import { connect } from "mongoose";
dotenv.config();

const mongoURI =  process.env.MONGO_URI_TEST;

beforeAll(async () => {
  await connect(mongoURI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
    await School.deleteMany({});
  });

describe("School API Endpoints", () => {
  test('should create a new school', async () => {
    const newSchool = {
      name: 'Test School',
      email:`school_${Date.now()}@example.com`,
      phone: '1234567890',
      address: '123 Test St',
      moto: 'Learning is fun!',
    };

    const response = await request(app).post('/api/add-school').send(newSchool);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe('School created successfully');
  });

  // Test fetching all schools
  it('should fetch all schools', async () => {
    const response = await request(app).get('/api/schools');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

    test('should create a new school and return its details', async () => {
      const newSchool = {
          name: 'New Test School',
          email: 'newtestschool@example.com',
          phone: '0987654321',
          address: '789 Test Blvd',
          moto: 'Education is key!',
      };

      const response = await request(app).post('/api/add-school').send(newSchool);
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('School created successfully');
      expect(response.body.school).toBeDefined(); // Check if school object is returned
      expect(response.body.school.name).toBe('New Test School'); // Check the name
      expect(response.body.school.email).toBe('newtestschool@example.com'); // Check the email
  });

  // Test fetching a school by ID
  it("should fetch a school by ID", async () => {
    const newSchool = {
      name: "School By ID",
      email: "schoolbyid77@example.com",
      phone: "1234567891",
      address: "456 Test Ave",
      moto: "Excellence in education",
    };
    const createdSchool = await request(app)
      .post("/api/add-school")
      .send(newSchool);
    console.log("created school", createdSchool.body);
    expect(createdSchool.statusCode).toBe(201);
    const schoolId = createdSchool.body.school._id;
    expect(mongoose.Types.ObjectId.isValid(schoolId)).toBe(true);
    const response = await request(app).get(`/api/schools/${schoolId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("School By ID");
  });
});
