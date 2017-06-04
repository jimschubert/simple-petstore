'use strict';
const fs        = require('fs');
const _         = require('lodash');
const rosie     = require('rosie');
const Faker     = require('faker');
const Factory   = rosie.Factory;

const db = {
    pets: [],
    tags: [],
    orders: [],
    users: [],
    categories: []
};

const petStatuses = ['available','pending','sold'];
const petTags = ['cute','cuddly','old','furry','fluffy','talkative','paper-trained','personality','loves children','loves outside'];
const userStatus = ['active', 'inactive'];
const orderStatuses = ['placed', 'approved', 'delivered'];
const imageSizes = [
    { height: 300, width: 200 },
    { height: 200, width: 300 },
    { height: 480, width: 640 },
    { height: 640, width: 480 },
    { height: 1024, width: 768 },
    { height: 100, width: 200 }
];
const categories = ['cat','dog','rodent','snake','fish','bird','reptile'];

Factory.define('pet')
    .sequence('id')
    .attr('categoryId', function() {return db.categories[_.random(db.categories.length-1)].id;})
    .attr('name', function() {return Faker.name.firstName();})
    .attr('photoUrls', ['name'], function(name){ return _.uniq(_.times(_.random(4), function(){
            const size = imageSizes[_.random(imageSizes.length-1)];
            return `${Faker.image.imageUrl(size.width, size.height, 'animals', false)}/${name}`;
        }));
    })
    .attr('tags', function(){ return _.uniq(_.times(3, function(){ return db.tags[_.random(db.tags.length-1)]; })); })
    .attr('status', function() {return petStatuses[_.random(2)];});

Factory.define('tag')
    .sequence('id')
    .attr('name');

Factory.define('user')
    .sequence('id')
    .attr('username', function() { return Faker.internet.userName(); })
    .attr('firstName', function(){ return Faker.name.firstName(); })
    .attr('lastName', function(){ return Faker.name.lastName(); })
    .attr('email', function(){ return Faker.internet.email(); })
    .attr('password', function(){ return Faker.internet.password(); })
    .attr('phone', function(){ return Faker.phone.phoneNumber(); })
    .attr('userStatus', function(){  return _.random(1) === 0 ? 'active': 'inactive'; });

Factory.define('category')
    .sequence('id')
    .attr('name', function() { return Faker.commerce.department(); });

Factory.define('order')
    .sequence('id')
    .attr('petId', function(){ return _.random(db.pets.length); })
    .attr('quantity', function(){ return _.random(1, 3); })
    .attr('shipDate', ['status'], function(status){
        if(status === 'delivered') { return Faker.date.past(); }
        if(status === 'approved') { return Faker.date.recent(14); }

        return Faker.date.recent(7);
    })
    .attr('status', function(){ return orderStatuses[_.random(2)]; })
    .attr('complete', ['status', 'shipDate'], function(status, shipDate){
        return status === 'delivered' && (+shipDate < +new Date());
    });

petTags.forEach((tag) => db.tags.push(Factory.build('tag', { name : tag })));
categories.forEach((category) => db.categories.push(Factory.build('category', { name : category })));
_(20).times(() => db.users.push(Factory.build('user')));
_(200).times(() => db.pets.push(Factory.build('pet')));
_(50).times(() => db.orders.push(Factory.build('order')));

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
