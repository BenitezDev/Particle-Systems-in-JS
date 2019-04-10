
class Vector2{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
}

class Particle{

    constructor(){
        
        this.active = false;

        this.img = smoke;
        this.img.halfWidth = this.img.width/2; 
        this.img.halfheight = this.img.height/2;

        this.position = new Vector2();
        
        this.opacityVelocity = 0.0;
        this.opacity = 0.0;

        this.rotation = 0.0;
        this.rotationVelocity = 0.0;

        this.scale = 1.0;
        this.scaleVelocity = 0.0;
        
        this.rnd = Math.random() < 0.33;
        this.appearing = false;
    }

    Activate(initialPosition, opacityVelocity, scale, scaleVelocity, initialRotation, rotationVelocity)
    {
        this.opacity = 0.0;
        this.opacityVelocity = opacityVelocity;

        this.position = initialPosition;

        this.scale = scale;
        this.scaleVelocity = scaleVelocity;

        this.rotation = initialRotation;
        this.rotationVelocity = rotationVelocity;

        this.appearing = true;
        this.active = true;
    }

    Update(deltatime)
    {
        if(this.appearing)
        {
            this.opacity += this.opacityVelocity * 3 *deltatime;
            if(this.opacity >= 1.0)
            {
                this.opacity = 1.0;
                this.appearing = false;
            }
        }
        else
        {
            this.opacity -= this.opacityVelocity * deltatime;
            if(this.opacity <= 0.0){
                // desactivate particle
                this.active = false;
            }
        }
      
        this.scale += this.scaleVelocity * deltatime;
        this.rotation += this.rotationVelocity * deltatime;
    }

    Draw(ctx)
    {
        
        ctx.globalCompositeOperation = this.rnd ? 'color-burn' : 'overlay';

        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.globalAlpha = this.opacity;

        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);

        ctx.translate(-this.img.halfWidth, -this.img.halfheight);

        ctx.drawImage(this.img, 0,0);    
        ctx.globalAlpha = 1;
        
        
        
        
        ctx.restore();
    }
}

class ParticleSystem {

    constructor (maxParticleCount = 100) {

        this.origin = new Vector2();

        this.MIN_TIME_TO_SPAWN_PARTICLE = 0.01;
        this.MAX_TIME_TO_SPAWN_PARTICLE = 0.1;
        
        this.MIN_OPACITY_DECREMENT_VELOCITY_VALUE = 1;
        this.MAX_OPACITY_DECREMENT_VELOCITY_VALUE = 2;

        this.MIN_SPAWNPOINT_DISPLACEMENT = -10;
        this.MAX_SPAWNPOINT_DISPLACEMENT = 10;

        this.MIN_INITIAL_SCALE = 0.1;
        this.MAX_INITIAL_SCALE = 0.7;

        this.MIN_SCALE_VELOCITY = 0.5;
        this.MAX_SCALE_VELOCITY = 1;

        this.MIN_INITIAL_ROTATION = -360;
        this.MAX_INITIAL_ROTATION = 360;

        this.MIN_ROTATION_VELOCITY = 0;
        this.MAX_ROTATION_VELOCITY = 0.5;
    
        this.nextTimeSpawnParticle = 
            RandomBetween(this.MIN_TIME_TO_SPAWN_PARTICLE,
                          this.MAX_TIME_TO_SPAWN_PARTICLE
            );

        this.maxParticleCount = maxParticleCount;
        
        // the particle array
        this.particles = new Array();
        //create the particle pool
        
        for(let i = 0; i < this.maxParticleCount; ++i)
        {
            let newParticle = new Particle();
            this.particles.push(newParticle);
        }
        

    }

    Update(deltatime)
    {
        this.nextTimeSpawnParticle -= deltatime;
        if(this.nextTimeSpawnParticle <= 0)
        {
            // activate particle
            // seatch for the first unactive particle
            for(var i = 0; i < this.particles.length; ++i)
            {
                if(!this.particles[i].active)
                {
                    let spawnpoint = new Vector2(
                        RandomBetween(
                            this.MIN_SPAWNPOINT_DISPLACEMENT,
                            this.MAX_SPAWNPOINT_DISPLACEMENT
                        ) 
                        + this.origin.x,
                        RandomBetween(
                            this.MIN_SPAWNPOINT_DISPLACEMENT,
                            this.MAX_SPAWNPOINT_DISPLACEMENT
                        ) 
                        + this.origin.y
                    );

                    let opacityVel = RandomBetween(
                        this.MIN_OPACITY_DECREMENT_VELOCITY_VALUE, 
                        this.MAX_OPACITY_DECREMENT_VELOCITY_VALUE
                    );

                    let initialScale = RandomBetween(
                        this.MIN_INITIAL_SCALE,
                        this.MAX_INITIAL_SCALE
                    );

                    let scaleVelocity = RandomBetween(
                      this.MIN_SCALE_VELOCITY,
                      this.MAX_SCALE_VELOCITY  
                    );
                    
                    let initialRotation = RandomBetween(
                        this.MIN_INITIAL_ROTATION,
                        this.MAX_INITIAL_ROTATION
                    );

                    let rotationVelocity = RandomBetween(
                        this.MIN_ROTATION_VELOCITY,
                        this.MAX_ROTATION_VELOCITY
                    );

                    this.particles[i].Activate(
                        spawnpoint,
                        opacityVel,
                        initialScale,
                        scaleVelocity,
                        initialRotation,
                        rotationVelocity
                    );

                    break;
                }
            }
            if(i == this.maxParticleCount) Console.log("Warning:particle system is not big enough");

            this.nextTimeSpawnParticle = 
            RandomBetween(this.MIN_TIME_TO_SPAWN_PARTICLE,
                          this.MAX_TIME_TO_SPAWN_PARTICLE
            );
        }
        this.particles.forEach(particle => {
            if(particle.active) 
                particle.Update(deltatime);
        });
    }

    Draw(ctx)
    {
        this.particles.forEach(particle => {
            if(particle.active)
            particle.Draw(ctx);
        });
    }
}

function ObtainRandom(maxValue)
{
    return Math.random() * maxValue;
}

function RandomBetween(minValue, maxValue){
    return (Math.random() * (maxValue - minValue)) + minValue;
}