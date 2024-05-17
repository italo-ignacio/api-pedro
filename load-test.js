import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend } from 'k6/metrics';

let CreateUserTrend = new Trend('Create_User');
let GetUserTrend = new Trend('Get_User');
let GetOneUserTrend = new Trend('Get_One_User');
let UpdateUserTrend = new Trend('Update_User');

let CreatePropertyTrend = new Trend('Create_Property');
let GetPropertyTrend = new Trend('Get_Property');
let GetOnePropertyTrend = new Trend('Get_One_Property');
let UpdatePropertyTrend = new Trend('Update_Property');
let UpdateAddressTrend = new Trend('Update_Property');

let CreateFlockTrend = new Trend('Create_Flock');
let GetFlockTrend = new Trend('Get_Flock');
let GetOneFlockTrend = new Trend('Get_One_Flock');
let UpdateFlockTrend = new Trend('Update_Flock');

export let options = {
  stages: [
    { duration: '30s', target: 250 },
    { duration: '30s', target: 500 }
  ]
};

const SLEEP_DURATION = 0.1;

const baseUrl = `http://10.107.130.129:3000/api/v1`;

const endpoints = {
  status: `${baseUrl}/`,
  user: `${baseUrl}/user`,
  property: `${baseUrl}/property`,
  flock: `${baseUrl}/flock`,
  address: `${baseUrl}/address`
};

const params = {
  headers: {
    'Content-Type': 'application/json'
  }
};

const tokenParams = {
  headers: {
    'Content-Type': 'application/json',
    authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoic3VwcG9ydEBzcC5zZW5haS5iciIsImlkIjoxLCJuYW1lIjoic3VwcG9ydCIsInJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE3MTU4Nzk1MTcsImV4cCI6MTcxODQ3MTUxN30.RAfuiuhccJX14sp528GL4ZqIUrxuxo_N2y_7yesq2_s'
  }
};

export default function () {
  var userId;
  var propertyId;
  var flockId;
  var addressId;

  group('user flow', function () {
    // Create user
    const createUserData = JSON.stringify({
      name: 'support',
      phone: '(00) 00000-0000',
      email: `support${Date.now()}@sp.senai.br`,
      password: 'Senai@127'
    });

    let createUserRes = http.post(endpoints.user, createUserData, params);
    check(createUserRes, {
      'status was 200 (add user)': (r) => {
        userId = r.json().payload.id;
        return r.status == 200;
      }
    });
    CreateUserTrend.add(createUserRes.timings.duration);

    sleep(SLEEP_DURATION);

    // Get User
    let getUser = http.get(endpoints.user, tokenParams);
    check(getUser, { 'status was 200 (get user)': (r) => r.status == 200 });
    GetUserTrend.add(getUser.timings.duration);

    sleep(SLEEP_DURATION);

    // Get one User
    let getOneUser = http.get(`${endpoints.user}/${userId}`, tokenParams);
    check(getOneUser, { 'status was 200 (get one user)': (r) => r.status == 200 });
    GetOneUserTrend.add(getOneUser.timings.duration);

    sleep(SLEEP_DURATION);

    // Update user
    const updateUserData = JSON.stringify({
      name: 'support Atualizado'
    });

    let updateUserRes = http.put(`${endpoints.user}/${userId}`, updateUserData, tokenParams);
    check(updateUserRes, {
      'status was 200 (update user)': (r) => r.status == 200
    });
    UpdateUserTrend.add(updateUserRes.timings.duration);

    sleep(SLEEP_DURATION);

    // Property flow ----------------------------------------
    group('property flow', function () {
      // Create property
      const createPropertyData = JSON.stringify({
        name: `Propriedade - ${Date.now()}`,
        totalArea: Math.floor(Math.random() * 5000) + 1,
        address: {
          zipCode: '00000-000',
          state: 'string',
          city: 'string',
          municipality: 'string',
          street: 'string',
          number: Math.floor(Math.random() * 5000) + 1
        },
        userId
      });

      let createPropertyRes = http.post(endpoints.property, createPropertyData, tokenParams);
      check(createPropertyRes, {
        'status was 200 (add property)': (r) => {
          propertyId = r.json().payload.id;
          addressId = r.json().payload.address.id;
          return r.status == 200;
        }
      });
      CreatePropertyTrend.add(createPropertyRes.timings.duration);

      sleep(SLEEP_DURATION);

      // Get Property
      let getProperty = http.get(endpoints.property, tokenParams);
      check(getProperty, { 'status was 200 (get property)': (r) => r.status == 200 });
      GetPropertyTrend.add(getProperty.timings.duration);

      sleep(SLEEP_DURATION);

      // Get one Property
      let getOneProperty = http.get(`${endpoints.property}/${propertyId}`, tokenParams);
      check(getOneProperty, { 'status was 200 (get one property)': (r) => r.status == 200 });
      GetOnePropertyTrend.add(getOneProperty.timings.duration);

      sleep(SLEEP_DURATION);

      // Update Property
      const updatePropertyData = JSON.stringify({
        name: `Propriedade Atualizada - ${Date.now()}`
      });

      let updatePropertyRes = http.put(
        `${endpoints.property}/${propertyId}`,
        updatePropertyData,
        tokenParams
      );
      check(updatePropertyRes, {
        'status was 200 (update property)': (r) => r.status == 200
      });
      UpdatePropertyTrend.add(updatePropertyRes.timings.duration);

      sleep(SLEEP_DURATION);

      // Update Address
      const updateAddressData = JSON.stringify({
        city: `Cidade Atualizada - ${Date.now()}`,
        municipality: `Municipio Atualizado - ${Date.now()}`,
        state: `Estado Atualizado - ${Date.now()}`,
        street: `Rua Atualizada - ${Date.now()}`
      });

      let updateAddressRes = http.put(
        `${endpoints.address}/${addressId}`,
        updateAddressData,
        tokenParams
      );
      check(updateAddressRes, {
        'status was 200 (update address)': (r) => r.status == 200
      });
      UpdateAddressTrend.add(updateAddressRes.timings.duration);

      sleep(SLEEP_DURATION);

      // Flock flow **********************************
      group('flock flow', function () {
        // Create Flock
        const createFlockData = JSON.stringify({
          name: `Rebanho - ${Date.now()}`,
          totalCalves: Math.floor(Math.random() * 5000) + 1,
          totalCows: Math.floor(Math.random() * 5000) + 1,
          totalHeifers: Math.floor(Math.random() * 5000) + 1,
          totalOthers: Math.floor(Math.random() * 5000) + 1,
          propertyId,
          userId
        });

        let createFlockRes = http.post(endpoints.flock, createFlockData, tokenParams);
        check(createFlockRes, {
          'status was 200 (add flock)': (r) => {
            flockId = r.json().payload.id;
            return r.status == 200;
          }
        });
        CreateFlockTrend.add(createFlockRes.timings.duration);

        sleep(SLEEP_DURATION);

        // Get Flock
        let getFlock = http.get(endpoints.flock, tokenParams);
        check(getFlock, { 'status was 200 (get flock)': (r) => r.status == 200 });
        GetFlockTrend.add(getFlock.timings.duration);

        sleep(SLEEP_DURATION);

        // Get one Flock
        let getOneFlock = http.get(`${endpoints.flock}/${flockId}`, tokenParams);
        check(getOneFlock, { 'status was 200 (get one flock)': (r) => r.status == 200 });
        GetOneFlockTrend.add(getOneFlock.timings.duration);

        sleep(SLEEP_DURATION);

        // Update Flock
        const updateFlockData = JSON.stringify({
          name: `Rebanho Atualizada - ${Date.now()}`
        });

        let updateFlockRes = http.put(
          `${endpoints.flock}/${flockId}`,
          updateFlockData,
          tokenParams
        );
        check(updateFlockRes, {
          'status was 200 (update flock)': (r) => r.status == 200
        });
        UpdateFlockTrend.add(updateFlockRes.timings.duration);

        sleep(SLEEP_DURATION);
      });
    });
  });
}
