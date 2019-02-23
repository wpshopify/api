import {
   post
} from '../request';


function endpointPosts() {
   return 'posts';
}

function endpointPostsProducts() {
   return 'posts/products';
}

function endpointPostsCollections() {
   return 'posts/collections';
}


/*

Gets products

Returns: promise

*/
function deletePosts(data = {}) {
   return post(endpointPosts(), data);
}

function setProductPostsRelationships() {
   return post(endpointPostsProducts());
}

function setCollectionPostsRelationships() {
   return post(endpointPostsCollections());
}

export {
   deletePosts,
   setProductPostsRelationships,
   setCollectionPostsRelationships
}
