/**
 * Modify entry
 */
function main(params) {
  if (!params.name || !params.comment) {
    return Promise.reject({ error: 'no name or comment'});
  }

  return {
    doc: {
       _id: params._id,
       _rev: params._rev,
       name: params.name,
       email: params.email,
       comment: params.comment
    }
  };
}
