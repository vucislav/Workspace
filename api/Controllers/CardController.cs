using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CardController : ControllerBase
    {
        public WorkspaceContext Context { get; set; }
        public CardController(WorkspaceContext context)
        {
            Context = context;
        }

        [HttpPost]
        [Route("CreateCard/{categoryId}")]
        public async Task<int> CreateCard(int categoryId, [FromBody] Card c) {
            var cat = await Context.Categories.FindAsync(categoryId);
            c.CategoryId = categoryId;
            Context.Cards.Add(c);
            await Context.SaveChangesAsync();
            return c.Id;
        }

        [HttpPut]
        [Route("EditCard/{id}")]
        public async Task<IActionResult> EditCard(int id, [FromBody] Card c) {
            Card old = await Context.Cards.FindAsync(id);
            Category oldCategory = await Context.Categories.FindAsync(old.CategoryId);
            Category newCategory = await Context.Categories.FindAsync(c.CategoryId);
            if (old == null || newCategory == null) return StatusCode(404);
            if (oldCategory.BoardId != newCategory.BoardId) return StatusCode(400);
            old.Name = c.Name;
            old.Description = c.Description;
            old.Tag = c.Tag;
            old.CategoryId = c.CategoryId;
            await Context.SaveChangesAsync();
            return StatusCode(204);
        }

        [HttpDelete]
        [Route("DeleteCard/{id}")]
        public async Task<IActionResult> DeleteCard(int id) {
            Card old = await Context.Cards.FindAsync(id);
            if (old == null) return StatusCode(404);
            Context.Cards.Remove(old);
            await Context.SaveChangesAsync();
            return StatusCode(204);
        }
    }
}
